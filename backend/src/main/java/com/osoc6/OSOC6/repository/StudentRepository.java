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
import org.springframework.transaction.annotation.Transactional;

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
    String USER_EDITION_ACCESS = "@authorizationUtil.userEditions(authentication.principal).contains(#edition)";

    /**
     * search by using the following:
     * /{STUDENT_PATH}/search/{STUDENT_FIND_BY_NAME_PATH}?name=nameOfStudent?edition=idOfEdition.
     * @param callName the callName of the student
     * @param edition the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_FIND_BY_NAME_PATH, rel = DumbledorePathWizard.STUDENT_FIND_BY_NAME_PATH)
    @Transactional
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + USER_EDITION_ACCESS)
    @Query("select s from Student s where s.callName like concat(:callName, '%') and s.edition.id = :edition")
    Page<Student> findByName(@Param("callName") String callName, @Param("edition") Long edition, Pageable pageable);

    /**
     * search by using the following:
     * /{STUDENT_PATH}/search/{STUDENT_FIND_BY_EMAIL_PATH}?email=emailOfStudent?edition=idOfEdition.
     * @param email the email of the student
     * @param edition the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_FIND_BY_EMAIL_PATH,
            rel = DumbledorePathWizard.STUDENT_FIND_BY_EMAIL_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + USER_EDITION_ACCESS)
    @Query("select s from Student s where s.email LIKE :email and s.edition.id = :edition")
    Page<Student> findByEmail(@Param("email") String email, @Param("edition") Long edition, Pageable pageable);

    /**
     * search by using the following:
     * /{STUDENT_PATH}/search/{STUDENT_FIND_BY_POTENTIAL_COACH_PATH}?edition=idOfEdition.
     * @param edition the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_FIND_BY_POTENTIAL_COACH_PATH,
            rel = DumbledorePathWizard.STUDENT_FIND_BY_POTENTIAL_COACH_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + USER_EDITION_ACCESS)
    @Query("select s from Student s where s.edition.id = :edition and "
            + "s.osocExperience = :#{@studentRepoHelp.COACH_EXPERIENCE}")
    Page<Student> potentialCoach(@Param("edition") Long edition, Pageable pageable);

    /**
     * Free text start with helper.
     */
    String LIKE_INPUT = "LIKE concat(:input, '%')";

    /**
     * Free text contains helper.
     */
    String LIKE_CONTAIN = "LIKE concat('%', :input, '%')";

    /**
     * search by using the following:
     * /{STUDENT_PATH}/search/{STUDENT_FIND_BY_FREE_TEXT_PATH}?name=nameOfStudent?edition=idOfEdition.
     * @param input the search input for free text search
     * @param edition the id of the edition this search is restricted to.
     * @param pageable argument needed to return a page.
     * @return list of matched editions
     */
    @RestResource(path = DumbledorePathWizard.STUDENT_FIND_BY_FREE_TEXT_PATH,
            rel = DumbledorePathWizard.STUDENT_FIND_BY_FREE_TEXT_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + USER_EDITION_ACCESS)
    @Query("select s from Student s where s.edition.id = :edition and (s.firstName " + LIKE_INPUT + " or s.lastName " + LIKE_INPUT
            + " or s.callName " + LIKE_INPUT + " or s.phoneNumber " + LIKE_INPUT + " or s.email " + LIKE_INPUT
            + " or s.bestSkill " + LIKE_INPUT + " or s.educationLevel " + LIKE_INPUT
            + " or s.currentDiploma " + LIKE_INPUT + " or s.additionalStudentInfo " + LIKE_CONTAIN
            + " or s.institutionName " + LIKE_INPUT + " or s.mostFluentLanguage " + LIKE_INPUT
            + " or :input in s.studies or s.writtenMotivation " + LIKE_CONTAIN
            + " or s.curriculumVitaeURI " + LIKE_INPUT + " or s.motivationURI " + LIKE_INPUT
            + " or s.portfolioURI " + LIKE_INPUT + ")"
            //+ " or s.gender " + LIKE_INPUT + " or s.englishProficiency " + LIKE_INPUT
            //+ " or s.osocExperience " + LIKE_INPUT
    )
    Page<Student> findFreeSearch(@Param("input") String input, @Param("edition") Long edition, Pageable pageable);

    /**
     * Query over students.
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
     * @param educationLevel field in student that is looked for
     * @param currentDiploma field in student that is looked for
     * @param institutionName field in student that is looked for
     * @param bestSkill field in student that is looked for
     * @param osocExperience field in student that is looked for
     * @param additionalStudentInfo field in student that is looked for
     * @param reason field in student that is looked for
     * @param pageable field in student that is looked for
     * @return Page of matching students
     */
    @SuppressWarnings("checkstyle:ParameterNumber")
    @Query("""
            select s from Student s inner join s.suggestions suggestions inner join s.assignments assignments
            where s.email = :email and s.firstName = :firstName and s.lastName = :lastName and
            s.callName = :callName and s.mostFluentLanguage = :mostFluentLanguage and
            s.englishProficiency = :englishProficiency and s.phoneNumber = :phoneNumber and
            s.curriculumVitaeURI = :curriculumVitaeURI and s.portfolioURI = :portfolioURI and
            s.motivationURI = :motivationURI and s.writtenMotivation = :writtenMotivation and
            s.educationLevel = :educationLevel and s.currentDiploma = :currentDiploma and
            s.institutionName = :institutionName and s.bestSkill = :bestSkill and s.osocExperience = :osocExperience and
            s.additionalStudentInfo = :additionalStudentInfo and suggestions.reason = :reason
            and assignments.reason = :reason
            """)
    Page<Student> findByQuery(
            @Param("email") String email, @Param("firstName") String firstName, @Param("lastName") String lastName,
            @Param("callName") String callName, @Param("mostFluentLanguage") String mostFluentLanguage,
            @Param("englishProficiency") EnglishProficiency englishProficiency,
            @Param("phoneNumber") String phoneNumber, @Param("curriculumVitaeURI") String curriculumVitaeURI,
            @Param("portfolioURI") String portfolioURI, @Param("motivationURI") String motivationURI,
            @Param("writtenMotivation") String writtenMotivation, @Param("educationLevel") String educationLevel,
            @Param("currentDiploma") String currentDiploma, @Param("institutionName") String institutionName,
            @Param("bestSkill") String bestSkill, @Param("osocExperience") OsocExperience osocExperience,
            @Param("additionalStudentInfo") String additionalStudentInfo,
            @Param("reason") String reason, Pageable pageable);



    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select s from Student s where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or s.edition.id in "
        + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Student> findAll(@NonNull Pageable pageable);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Student> findById(@NonNull Long aLong);
}
