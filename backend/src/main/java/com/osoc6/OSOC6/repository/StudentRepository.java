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
    /**
     * I tell you this...
     */
    String HELP = "@authorizationUtil.userEditions(authentication.principal).contains(#editionId)";

    /**
     * search by using the following:
     * /{DumbledorePathWizard.STUDENT_PATH}/search/findByName?name=nameOfStudent?edition=nameOfEdition.
     * @param callName the callName of the student
     * @param editionId the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = "nameStartsWith", rel = "nameStartsWith")
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + HELP)
    @Query("select s from Student s where s.callName like concat(:callName, '%') and s.edition.name = :edition")
    Page<Student> findByName(@Param("callName") String callName, @Param("edition") Long editionId, Pageable pageable);

    /**
     * search by using the following:
     * /{DumbledorePathWizard.STUDENT_PATH}/search/findByEmail?email=emailOfStudent?edition=nameOfEdition.
     * @param email the email of the student
     * @param editionId the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = "findByEmail", rel = "findByEmail")
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + HELP)
    @Query("select s from Student s where s.email LIKE :email and s.edition = :edition")
    Page<Student> findByEmail(@Param("email") String email, @Param("edition") Long editionId, Pageable pageable);

    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + HELP)
    @Query("select s from Student s where s.edition.id = :edition and "
            + "s.osocExperience = :#{@studentRepoHelp.COACH_EXPERIENCE}")
    Page<Student> potentialCoach(@Param("edition") Long editionId, Pageable pageable);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select s from Student s where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or s.edition in "
        + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Student> findAll(Pageable pageable);

    @Override
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !returnObject.present or "
        + "@authorizationUtil.userEditions(authentication.principal).contains(returnObject.get.edition.id)")
    Optional<Student> findById(Long aLong);

    // Needs a findBy free text.
    String LIKE_INPUT = "LIKE concat(:input, '%')";
    String LIKE_CONTAIN = "LIKE concat('%', :input, '%')";
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select s from Student s where s.firstName " + LIKE_INPUT + " or s.lastName " + LIKE_INPUT
        + " or s.callName " + LIKE_INPUT + " or s.phoneNumber " + LIKE_INPUT + " or s.email " + LIKE_INPUT
        + " or s.bestSkill " + LIKE_INPUT + " or s.educationLevel " + LIKE_INPUT
        + " or s.currentDiploma " + LIKE_INPUT + " or s.additionalStudentInfo " + LIKE_CONTAIN
        + " or s.institutionName " + LIKE_INPUT + " or s.mostFluentLanguage " + LIKE_INPUT
        + " or :input in s.studies or s.writtenMotivation " + LIKE_CONTAIN
        + " or s.curriculumVitaeURI " + LIKE_INPUT + " or s.motivationURI " + LIKE_INPUT
        + " or s.portfolioURI " + LIKE_INPUT

        //+ " or s.gender " + LIKE_INPUT + " or s.englishProficiency " + LIKE_INPUT
        //+ " or s.osocExperience " + LIKE_INPUT
    )
    Page<Student> findFreeSearch(@Param("input") String input, Pageable pageable);
}
