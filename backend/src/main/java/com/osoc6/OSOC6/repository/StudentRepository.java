package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link Student},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.STUDENT_PATH,
        path = DumbledorePathWizard.STUDENT_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select s from Student s where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or s.edition.id in "
        + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Student> findAll(@NonNull Pageable pageable);


    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Student> findById(@NonNull Long aLong);

    /**
     * Get all projects within an edition.
     * @param editionId the id of the edition you want to see the projects of
     * @param pageable argument needed to return a page
     * @return page of matching projects
     */
    @RestResource(path = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH,
            rel = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH
            + " or @spelUtil.userEditions(authentication.principal).contains(#edition)")
    @Query("select s from Student s where s.edition.id = :edition")
    Page<Student> findByEdition(@Param("edition") Long editionId, @NonNull Pageable pageable);

    /**
     * Query over students by their field or by a reason provided in suggestion or assignment.
     * We need to use cast keyword instead of native :: because ':' means something to Spring.
     *
     * @param edition the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page
     * @return Page of matching students
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_QUERY_PATH,
            rel = DumbledorePathWizard.STUDENT_QUERY_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH
            + " or @spelUtil.userEditions(authentication.principal).contains(#edition)")
    @Query(value =
            "SELECT DISTINCT ON (stud.id) stud.* FROM student stud "
                + "INNER JOIN (SELECT inner_ed.* FROM edition inner_ed WHERE :edition is not null and "
                    + "inner_ed.id = :edition) as ed ON (stud.edition_id = ed.id) "
            + "where "
            + "(:freeText is null or to_tsvector( "
                + "CAST(stud as text) || "
                + "(select string_agg(CAST(sugg as text), '') from suggestion sugg where sugg.student_id = stud.id) || "
                + "(select string_agg(CAST(assign as text), '') from assignment assign where assign.student_id = stud.id) "
            + ") @@ to_tsquery(:#{@spelUtil.safeString(#freeText)})) "
            + "and (:skills is null or to_tsvector( "
                + "(select string_agg(CAST(studskill as text), '') from student_skills studskill where studskill.student_id = stud.id) "
            + ") @@ to_tsquery(:#{@spelUtil.safeString(#skills)})) "
            + "and (:experience is null or stud.osoc_experience = any(array[:#{@spelUtil.safeString(#experience)}]))",
            nativeQuery = true)
    Page<Student> findByQuery(@Param("edition") Long edition, @Param("freeText") String freeText,
                              @Param("skills") String skills, @Param("experience") List<String> experience,
                              Pageable pageable);

    /**
     * Return the students that are assigned to multiple projects through valid assignments.
     * @param edition the edition in which this query operates.
     * @param pageable field in student that is looked for
     * @return Page of matching students
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_CONFLICT_PATH,
            rel = DumbledorePathWizard.STUDENT_CONFLICT_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH
            + " or @spelUtil.userEditions(authentication.principal).contains(#edition)")
    @Query(value =
        "SELECT DISTINCT ON (stud.id) stud.* FROM student stud "
            + "INNER JOIN (SELECT inner_ed.* FROM edition inner_ed WHERE :edition is not null and "
            + "inner_ed.id = :#{@spelUtil.safeLong(#edition)}) as ed ON (stud.edition_id = ed.id) "
        + "where (Select count(distinct skill.id) "
            + "from (select inner_assign.* from assignment inner_assign "
            + "where inner_assign.is_valid = true and inner_assign.student_id = stud.id) as assign "
            + "inner join project_skill skill on (assign.project_skill_id = skill.id)) > 1", nativeQuery = true)
    Page<Student> findConflict(@Param("edition") Long edition, Pageable pageable);
}
