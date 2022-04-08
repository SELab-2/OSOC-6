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

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select s from Student s where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or s.edition.id in "
        + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Student> findAll(@NonNull Pageable pageable);

    /**
     * Query over students.
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
    @Transactional
    @SuppressWarnings("checkstyle:ParameterNumber")
    @RestResource(path = DumbledorePathWizard.STUDENT_QUERY_PATH,
            rel = DumbledorePathWizard.STUDENT_QUERY_PATH)
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + USER_EDITION_ACCESS)
    @Query(value =
        "SELECT DISTINCT stud.* FROM student stud "
        + "INNER JOIN (SELECT inner_ed.* FROM edition inner_ed WHERE :edition is not null and "
            + "inner_ed.id = :#{@authorizationUtil.safeLong(#edition)}) as ed ON (stud.edition_id = ed.id) "
        + "LEFT JOIN suggestion sugg ON (sugg.student_id = stud.id) "
        + "LEFT JOIN assignment assign ON (assign.student_id = stud.id) "
        + "WHERE (:email is null or stud.email = :#{@authorizationUtil.safeString(#email)}) and "
        + "(:firstName is null or stud.first_name = :#{@authorizationUtil.safeString(#firstName)}) and "
        + "(:lastName is null or stud.last_name = :#{@authorizationUtil.safeString(#lastName)}) and "
        + "(:callName is null or stud.call_name ILIKE :#{@authorizationUtil.stringBetween(#callName)}) and "
        + "(:mostFluentLanguage is null or stud.most_fluent_language = :#{@authorizationUtil.safeString(#mostFluentLanguage)}) and "
        + "(:englishProficiency is null or stud.english_proficiency = :#{@authorizationUtil.safeEnum(#englishProficiency)}) and "
        + "(:phoneNumber is null or stud.phone_number = :#{@authorizationUtil.safeString(#phoneNumber)}) and "
        + "(:curriculumVitaeURI is null or stud.curriculum_vitaeuri = :#{@authorizationUtil.safeString(#curriculumVitaeURI)}) and "
        + "(:portfolioURI is null or stud.portfoliouri = :#{@authorizationUtil.safeString(#portfolioURI)}) and "
        + "(:motivationURI is null or stud.motivationuri = :#{@authorizationUtil.safeString(#motivationURI)}) and "
        + "(:writtenMotivation is null or stud.written_motivation = :#{@authorizationUtil.safeString(#writtenMotivation)}) and"
        + "(:educationLevel is null or stud.education_level = :#{@authorizationUtil.safeString(#educationLevel)}) and "
        + "(:currentDiploma is null or stud.current_diploma = :#{@authorizationUtil.safeString(#currentDiploma)}) and "
        + "(:institutionName is null or stud.institution_name = :#{@authorizationUtil.safeString(#institutionName)}) and "
        + "(:bestSkill is null or stud.best_skill = :#{@authorizationUtil.safeString(#bestSkill)}) and "
        + "(:osocExperience is null or stud.osoc_experience = :#{@authorizationUtil.safeEnum(#osocExperience)}) and "
        + "(:additionalStudentInfo is null or stud.additional_student_info = :#{@authorizationUtil.safeString(#additionalStudentInfo)}) and "
        + "(:reason is null or sugg.reason LIKE :#{@authorizationUtil.stringBetween(#reason)} or assign.reason LIKE :#{@authorizationUtil.stringBetween(#reason)})"
        , nativeQuery = true)
    Page<Student> findByQuery(@Param("edition") Long edition,
                              @Param("email") String email,
                              @Param("firstName") String firstName, @Param("lastName") String lastName,
                              @Param("callName") String callName, @Param("mostFluentLanguage") String mostFluentLanguage,
                              @Param("englishProficiency") EnglishProficiency englishProficiency,
                              @Param("phoneNumber") String phoneNumber, @Param("curriculumVitaeURI") String curriculumVitaeURI,
                              @Param("portfolioURI") String portfolioURI, @Param("motivationURI") String motivationURI,
                              @Param("writtenMotivation") String writtenMotivation, @Param("educationLevel") String educationLevel,
                              @Param("currentDiploma") String currentDiploma, @Param("institutionName") String institutionName,
                              @Param("bestSkill") String bestSkill,
                              @Param("osocExperience") OsocExperience osocExperience,
                              @Param("additionalStudentInfo") String additionalStudentInfo,
                              @Param("reason") String reason,
                              Pageable pageable);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Student> findById(@NonNull Long aLong);
}
