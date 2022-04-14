package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
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
     * Query over students by their field or by a reason provided in suggestion or assignment.
     *
     * @param edition the id of the edition this search is restricted to.
     * @param email field in student that is looked for
     * @param firstName field in student that is looked for
     * @param lastName field in student that is looked for
     * @param callName field in student that is looked for
     * @param mostFluentLanguage field in student that is looked for
     * @param englishProficiency field in student that is looked for
     * @param phoneNumber field in student that is looked for
     * @param curriculumVitaeURI field in student that is looked for
     * @param portfolioURI field in student that is looked for
     * @param motivationURI field in student that is looked for
     * @param writtenMotivation field in student that is looked for
     * @param currentDiploma field in student that is looked for
     * @param institutionName field in student that is looked for
     * @param bestSkill field in student that is looked for
     * @param osocExperience field in student that is looked for
     * @param additionalStudentInfo field in student that is looked for
     * @param skill field in student that is looked for
     * @param reason field in student that is looked for
     * @param pageable field in student that is looked for
     * @return Page of matching students
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_QUERY_PATH,
            rel = DumbledorePathWizard.STUDENT_QUERY_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH
            + " or @spelUtil.userEditions(authentication.principal).contains(#edition)")
    @Query(value =
        "SELECT DISTINCT ON (stud.id) stud.* FROM student stud "
        + "INNER JOIN (SELECT inner_ed.* FROM edition inner_ed WHERE :edition is not null and "
            + "inner_ed.id = :#{@spelUtil.safeLong(#edition)}) as ed ON (stud.edition_id = ed.id) "
        + "LEFT JOIN student_skills studskill on (stud.id = studskill.student_id) "
        + "LEFT JOIN suggestion sugg ON (sugg.student_id = stud.id) "
        + "LEFT JOIN assignment assign ON (assign.student_id = stud.id) "
        + "WHERE (:email is null or stud.email = :#{@spelUtil.safeString(#email)}) and "
        + "(:firstName is null or stud.first_name = :#{@spelUtil.safeString(#firstName)}) and "
        + "(:lastName is null or stud.last_name = :#{@spelUtil.safeString(#lastName)}) and "
        + "(:callName is null or stud.call_name ILIKE :#{@spelUtil.formatContains(#callName)}) and "
        + "(:mostFluentLanguage is null or stud.most_fluent_language = :#{@spelUtil.safeString(#mostFluentLanguage)}) and "
        + "(:englishProficiency is null or stud.english_proficiency = :#{@spelUtil.safeEnum(#englishProficiency)}) and "
        + "(:phoneNumber is null or stud.phone_number = :#{@spelUtil.safeString(#phoneNumber)}) and "
        + "(:curriculumVitaeURI is null or stud.curriculum_vitaeuri = :#{@spelUtil.safeString(#curriculumVitaeURI)}) and "
        + "(:portfolioURI is null or stud.portfoliouri = :#{@spelUtil.safeString(#portfolioURI)}) and "
        + "(:motivationURI is null or stud.motivationuri = :#{@spelUtil.safeString(#motivationURI)}) and "
        + "(:writtenMotivation is null or stud.written_motivation = :#{@spelUtil.safeString(#writtenMotivation)}) and"
        + "(:currentDiploma is null or stud.current_diploma = :#{@spelUtil.safeString(#currentDiploma)}) and "
        + "(:institutionName is null or stud.institution_name = :#{@spelUtil.safeString(#institutionName)}) and "
        + "(:bestSkill is null or stud.best_skill = :#{@spelUtil.safeString(#bestSkill)}) and "
        + "(:osocExperience is null or stud.osoc_experience = :#{@spelUtil.safeEnum(#osocExperience)}) and "
        + "(:additionalStudentInfo is null or stud.additional_student_info = :#{@spelUtil.safeString(#additionalStudentInfo)}) and "
        + "(:skill is null or studskill.skills LIKE :#{@spelUtil.formatContains(#skill)}) and "
        + "(:reason is null or sugg.reason LIKE :#{@spelUtil.formatContains(#reason)} or assign.reason LIKE :#{@spelUtil.formatContains(#reason)})",
            nativeQuery = true)
    Page<Student> findByQuery(@Param("edition") Long edition,
                              @Param("email") String email,
                              @Param("firstName") String firstName, @Param("lastName") String lastName,
                              @Param("callName") String callName, @Param("mostFluentLanguage") String mostFluentLanguage,
                              @Param("englishProficiency") EnglishProficiency englishProficiency,
                              @Param("phoneNumber") String phoneNumber, @Param("curriculumVitaeURI") String curriculumVitaeURI,
                              @Param("portfolioURI") String portfolioURI, @Param("motivationURI") String motivationURI,
                              @Param("writtenMotivation") String writtenMotivation,
                              @Param("currentDiploma") String currentDiploma, @Param("institutionName") String institutionName,
                              @Param("bestSkill") String bestSkill,
                              @Param("osocExperience") OsocExperience osocExperience,
                              @Param("additionalStudentInfo") String additionalStudentInfo,
                              @Param("skill") String skill,
                              @Param("reason") String reason,
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
        + "where (Select count(distinct proj.id) "
            + "from (select inner_assign.* from assignment inner_assign "
            + "where inner_assign.is_valid = true and inner_assign.student_id = stud.id) as assign "
            + "inner join project proj on (assign.project_id = proj.id)) > 1", nativeQuery = true)
    Page<Student> findConflict(@Param("edition") Long edition, Pageable pageable);
}
