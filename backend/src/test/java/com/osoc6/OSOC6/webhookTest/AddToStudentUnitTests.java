package com.osoc6.OSOC6.webhookTest;

import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.exception.WebhookException;
import com.osoc6.OSOC6.webhook.FormField;
import com.osoc6.OSOC6.webhook.Option;
import com.osoc6.OSOC6.webhook.QuestionKey;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Unit tests for testing whether answers to the form are correctly to a student.
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class AddToStudentUnitTests {

    /**
     * The test student, used to add answers to.
     */
    private Student student;

    @BeforeEach
    private void setUp() {
        student = new Student();
    }

    /**
     * Fill in the English proficiency options in a form field.
     * @param formField the form field to put the options into
     */
    private void setupEnglishProficiency(final FormField formField) {
        formField.setOptions(List.of(
                new Option("1", "read only ★"),
                new Option("2", "simple ★★"),
                new Option("3", "expressive ★★★"),
                new Option("4", "extensive ★★★★"),
                new Option("5", "fluent ★★★★★")));
    }

    /**
     * Fill in the gender options in a form field.
     * @param formField the form field to put the options into
     */
    private void setupGender(final FormField formField) {
        formField.setOptions(List.of(
                new Option("1", Gender.FEMALE.getGenderString()),
                new Option("2", Gender.MALE.getGenderString()),
                new Option("3", Gender.TRANSGENDER.getGenderString()),
                new Option("4", Gender.NOT_SPECIFIED.getGenderString())));
    }

    @Test
    public void add_work_type_works() {
        String workType = "Yes, I can work as a volunteer in Belgium";
        FormField formField = new FormField(QuestionKey.WORK_TYPE, workType);

        formField.addToStudent(student);

        assertEquals(workType, student.getWorkType());
    }

    @Test
    public void provided_daytime_responsibilities_is_added() {
        String daytimeResponsibilities = "Taking care of my nana";
        FormField formField = new FormField(QuestionKey.DAY_RESPONSIBILITIES, daytimeResponsibilities);

        formField.addToStudent(student);

        assertEquals(daytimeResponsibilities, student.getDaytimeResponsibilities());
    }

    @Test
    public void no_provided_daytime_responsibilities_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.DAY_RESPONSIBILITIES, null);

        formField.addToStudent(student);

        assertNotNull(student.getDaytimeResponsibilities());
    }

    @Test
    public void add_birth_name_works() {
        String birthName = "birthname";
        FormField formField = new FormField(QuestionKey.BIRTH_NAME, birthName);

        formField.addToStudent(student);

        assertEquals(birthName, student.getFirstName());
    }

    @Test
    public void add_last_name_works() {
        String lastName = "lastname";
        FormField formField = new FormField(QuestionKey.LAST_NAME, lastName);

        formField.addToStudent(student);

        assertEquals(lastName, student.getLastName());
    }

    @Test
    public void provided_callname_is_added() {
        String callName = "callname";
        FormField formField = new FormField(QuestionKey.CALL_NAME, callName);

        formField.addToStudent(student);

        assertEquals(callName, student.getCallName());
    }

    @Test
    public void no_provided_callname_is_firstname_and_lastname() {
        String firstname = "firstname";
        String lastname = "lastname";
        student.setFirstName(firstname);
        student.setLastName(lastname);

        FormField formField = new FormField(QuestionKey.CALL_NAME, null);

        formField.addToStudent(student);

        assertEquals(firstname + " " + lastname, student.getCallName());
    }

    @Test
    public void add_female_gender_works() {
        Gender gender = Gender.FEMALE;
        String optionId = "1";

        FormField formField = new FormField(QuestionKey.GENDER, optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_male_gender_works() {
        Gender gender = Gender.MALE;
        String optionId = "2";

        FormField formField = new FormField(QuestionKey.GENDER, optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_transgender_gender_works() {
        Gender gender = Gender.TRANSGENDER;
        String optionId = "3";

        FormField formField = new FormField(QuestionKey.GENDER, optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_not_specified_gender_works() {
        Gender gender = Gender.NOT_SPECIFIED;
        String optionId = "4";

        FormField formField = new FormField(QuestionKey.GENDER, optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_invalid_gender_throws_exception() {
        String invalidGender = "Rubicks cube";
        String optionId = "1";

        FormField formField = new FormField(QuestionKey.GENDER, optionId);
        formField.setOptions(List.of(new Option(optionId, invalidGender)));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void provided_pronouns_are_added() {
        String pronouns = "they/them";
        FormField formField = new FormField(QuestionKey.WHICH_PRONOUNS, pronouns);

        formField.addToStudent(student);

        assertEquals(pronouns, student.getPronouns());
    }

    @Test
    public void no_provided_pronouns_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.WHICH_PRONOUNS, null);

        formField.addToStudent(student);

        assertNotNull(student.getPronouns());
    }

    @Test
    public void provided_other_pronouns_are_added() {
        String pronouns = "mir/zir/zar";
        FormField formField = new FormField(QuestionKey.OTHER_PRONOUNS, pronouns);

        formField.addToStudent(student);

        assertEquals(pronouns, student.getPronouns());
    }

    @Test
    public void no_provided_other_pronouns_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.OTHER_PRONOUNS, null);

        formField.addToStudent(student);

        assertNotNull(student.getPronouns());
    }

    @Test
    public void add_most_fluent_language_works() {
        String language = "French";
        FormField formField = new FormField(QuestionKey.WHICH_LANGUAGE, language);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void provided_other_most_fluent_language_is_added() {
        String language = "Iraqw";
        FormField formField = new FormField(QuestionKey.OTHER_LANGUAGE, language);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void no_provided_other_language_does_not_overwrite_language() {
        String language = "French";
        student.setMostFluentLanguage(language);

        FormField formField = new FormField(QuestionKey.OTHER_LANGUAGE, null);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void add_read_not_write_english_proficiency_works() {
        String optionId = "1";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.READ_NOT_WRITE, student.getEnglishProficiency());
    }

    @Test
    public void add_simple_conversation_english_proficiency_works() {
        String optionId = "2";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.SIMPLE_CONVERSATION, student.getEnglishProficiency());
    }

    @Test
    public void add_expressive_english_proficiency_works() {
        String optionId = "3";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.EXPRESSIVE, student.getEnglishProficiency());
    }

    @Test
    public void add_extensive_english_proficiency_works() {
        String optionId = "4";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.EXTENSIVE, student.getEnglishProficiency());
    }

    @Test
    public void add_fluent_english_proficiency_works() {
        String optionId = "5";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.FLUENT, student.getEnglishProficiency());
    }

    @Test
    public void no_stars_in_english_proficiency_throws_exception() {
        String optionId = "1";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        formField.setOptions(List.of(new Option(optionId, "no stars in this string")));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void too_many_stars_in_english_proficiency_throws_exception() {
        String optionId = "1";
        FormField formField = new FormField(QuestionKey.RATE_ENGLISH, optionId);
        formField.setOptions(List.of(new Option(optionId, "to many stars ★★★★★★ in this string")));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void add_phone_number_works() {
        String phoneNumber = "+32456742567864356";
        FormField formField = new FormField(QuestionKey.PHONE_NUMBER, phoneNumber);

        formField.addToStudent(student);

        assertEquals(phoneNumber, student.getPhoneNumber());
    }

    @Test
    public void add_email_adress_works() {
        String email = "test@test.com";
        FormField formField = new FormField(QuestionKey.EMAIL_ADDRESS, email);

        formField.addToStudent(student);

        assertEquals(email, student.getEmail());
    }

    @Test
    public void provided_upload_cv_as_list_of_map_is_added() {
        String url = "https://my.cv.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField(QuestionKey.UPLOAD_CV, listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getCurriculumVitaeURI());
    }

    @Test
    public void no_provided_upload_cv_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.UPLOAD_CV, null);

        formField.addToStudent(student);

        assertNotNull(student.getCurriculumVitaeURI());
    }

    @Test
    public void provided_link_cv_is_added() {
        String url = "https://my.cv.com";
        FormField formField = new FormField(QuestionKey.LINK_CV, url);

        formField.addToStudent(student);

        assertEquals(url, student.getCurriculumVitaeURI());
    }

    @Test
    public void no_provided_link_cv_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.LINK_CV, null);

        formField.addToStudent(student);

        assertNotNull(student.getCurriculumVitaeURI());
    }

    @Test
    public void provided_upload_portfolio_as_list_of_map_is_added() {
        String url = "https://my.portfolio.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField(QuestionKey.UPLOAD_PORTFOLIO, listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getPortfolioURI());
    }

    @Test
    public void no_provided_upload_portfolio_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.UPLOAD_PORTFOLIO, null);

        formField.addToStudent(student);

        assertNotNull(student.getPortfolioURI());
    }

    @Test
    public void provided_link_portfolio_is_added() {
        String url = "https://my.portfolio.com";
        FormField formField = new FormField(QuestionKey.LINK_PORTOFLIO, url);

        formField.addToStudent(student);

        assertEquals(url, student.getPortfolioURI());
    }

    @Test
    public void no_provided_link_portfolio_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.LINK_PORTOFLIO, null);

        formField.addToStudent(student);

        assertNotNull(student.getPortfolioURI());
    }

    @Test
    public void provided_upload_motivation_as_list_of_map_is_added() {
        String url = "https://my.motivation.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField(QuestionKey.UPLOAD_MOTIVATION, listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getMotivationURI());
    }

    @Test
    public void no_provided_upload_motivation_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.UPLOAD_MOTIVATION, null);

        formField.addToStudent(student);

        assertNotNull(student.getMotivationURI());
    }

    @Test
    public void provided_link_motivation_is_added() {
        String url = "https://my.motivation";
        FormField formField = new FormField(QuestionKey.LINK_MOTIVATION, url);

        formField.addToStudent(student);

        assertEquals(url, student.getMotivationURI());
    }

    @Test
    public void no_provided_link_motivation_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.LINK_MOTIVATION, null);

        formField.addToStudent(student);

        assertNotNull(student.getMotivationURI());
    }

    @Test
    public void provided_written_motivation_is_added() {
        String motivation = "A 'long' text explaining why I would like to join OSOC.";
        FormField formField = new FormField(QuestionKey.WRITE_MOTIVATION, motivation);

        formField.addToStudent(student);

        assertEquals(motivation, student.getWrittenMotivation());
    }

    @Test
    public void no_provided_written_motivation_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.WRITE_MOTIVATION, null);

        formField.addToStudent(student);

        assertNotNull(student.getWrittenMotivation());
    }

    @Test
    public void add_fun_fact_works() {
        String funFact = "A fun fact about me";
        FormField formField = new FormField(QuestionKey.FUN_FACT, funFact);

        formField.addToStudent(student);

        assertEquals(funFact, student.getFunFact());
    }

    @Test
    public void all_non_other_studies_are_added() {
        List<String> studies = List.of("Backend development", "Design");
        List<String> optionIds = List.of("1", "3", "4");

        FormField formField = new FormField(QuestionKey.STUDY, optionIds);
        formField.setOptions(List.of(
                new Option("1", "Backend development"),
                new Option("2", "Frontend development"),
                new Option("3", "Design"),
                new Option("4", "Other")
        ));

        formField.addToStudent(student);

        assertIterableEquals(studies, student.getStudies());
    }

    @Test
    public void provided_other_study_is_added() {
        String study = "Special study";
        FormField formField = new FormField(QuestionKey.OTHER_STUDY, study);

        formField.addToStudent(student);

        assertTrue(student.getStudies().contains(study));
    }

    @Test
    public void no_provided_other_study_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.OTHER_STUDY, null);

        formField.addToStudent(student);

        assertFalse(student.getStudies().contains(null));
        assertEquals(0, student.getStudies().size());
    }

    @Test
    public void provided_non_other_diploma_is_added() {
        String diploma = "Bachelor of Science";
        String optionId = "1";

        FormField formField = new FormField(QuestionKey.DIPLOMA, List.of(optionId));
        formField.setOptions(List.of(
                new Option(optionId, diploma),
                new Option("2", "Master of Science"),
                new Option("3", "High school"),
                new Option("4", "Other")
        ));

        formField.addToStudent(student);

        assertEquals(diploma, student.getCurrentDiploma());
    }

    @Test
    public void provided_literal_other_diploma_is_not_added() {
        String diploma = "Other";
        String optionId = "4";

        FormField formField = new FormField(QuestionKey.DIPLOMA, List.of(optionId));
        formField.setOptions(List.of(
                new Option(optionId, diploma),
                new Option("2", "Master of Science"),
                new Option("3", "High school"),
                new Option("4", "Other")
        ));

        formField.addToStudent(student);

        assertNotEquals(diploma, student.getCurrentDiploma());
    }

    @Test
    public void provided_other_diploma_is_added() {
        String diploma = "Special diploma";
        FormField formField = new FormField(QuestionKey.OTHER_DIPLOMA, diploma);

        formField.addToStudent(student);

        assertEquals(diploma, student.getCurrentDiploma());
    }

    @Test
    public void no_provided_other_diploma_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.OTHER_DIPLOMA, null);

        formField.addToStudent(student);

        assertNotNull(student.getCurrentDiploma());
    }

    @Test
    public void provided_total_degree_years_is_added() {
        Integer totalDegreeYears = 3;
        FormField formField = new FormField(QuestionKey.TOTAL_DEGREE_YEARS, totalDegreeYears);

        formField.addToStudent(student);

        assertEquals(totalDegreeYears, student.getDurationCurrentDegree());
    }

    @Test
    public void no_provided_total_degree_years_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.TOTAL_DEGREE_YEARS, null);

        formField.addToStudent(student);

        assertNotNull(student.getDurationCurrentDegree());
    }

    @Test
    public void provided_current_degree_year_is_added() {
        String currentDegreeYear = "second year";
        FormField formField = new FormField(QuestionKey.CURRENT_DEGREE_YEAR, currentDegreeYear);

        formField.addToStudent(student);

        assertEquals(currentDegreeYear, student.getYearInCourse());
    }

    @Test
    public void no_provided_current_degree_year_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.CURRENT_DEGREE_YEAR, null);

        formField.addToStudent(student);

        assertNotNull(student.getYearInCourse());
    }

    @Test
    public void provided_college_name_is_added() {
        String collegeName = "UGent";
        FormField formField = new FormField(QuestionKey.COLLEGE_NAME, collegeName);

        formField.addToStudent(student);

        assertEquals(collegeName, student.getInstitutionName());
    }

    @Test
    public void no_provided_college_name_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.COLLEGE_NAME, null);

        formField.addToStudent(student);

        assertNotNull(student.getInstitutionName());
    }

    @Test
    public void all_non_other_roles_are_added() {
        List<String> roles = List.of("Backend developer", "Photographer");
        List<String> optionIds = List.of("1", "2", "4");

        FormField formField = new FormField(QuestionKey.ROLES, optionIds);
        formField.setOptions(List.of(
                new Option("1", "Backend developer"),
                new Option("2", "Photographer"),
                new Option("3", "Design"),
                new Option("4", "Other")
        ));

        formField.addToStudent(student);

        assertIterableEquals(roles, student.getSkills());
    }

    @Test
    public void provided_other_role_is_added() {
        String role = "Special role";
        FormField formField = new FormField(QuestionKey.OTHER_ROLE, role);

        formField.addToStudent(student);

        assertTrue(student.getSkills().contains(role));
    }

    @Test
    public void no_provided_other_role_does_not_add_null() {
        FormField formField = new FormField(QuestionKey.OTHER_ROLE, null);

        formField.addToStudent(student);

        assertFalse(student.getSkills().contains(null));
        assertEquals(0, student.getSkills().size());
    }

    @Test
    public void add_best_skill_works() {
        String bestSkill = "My best skill";
        FormField formField = new FormField(QuestionKey.BEST_SKILL, bestSkill);

        formField.addToStudent(student);

        assertEquals(bestSkill, student.getBestSkill());
    }

    @Test
    public void valid_osoc_participation_is_added() {
        OsocExperience osocExperience = OsocExperience.NONE;
        String optionId = "1";

        FormField formField = new FormField(QuestionKey.OSOC_EXPERIENCE, optionId);
        formField.setOptions(List.of(
                new Option("1", osocExperience.getParticipation()),
                new Option("2", OsocExperience.YES_NO_STUDENT_COACH.getParticipation())
        ));

        formField.addToStudent(student);

        assertEquals(osocExperience, student.getOsocExperience());
    }

    @Test
    public void invalid_osoc_participation_throws_exception() {
        String experience = "Maybe I have experience";

        FormField formField = new FormField(QuestionKey.OSOC_EXPERIENCE, "1");
        formField.setOptions(List.of(
                new Option("1", experience),
                new Option("2", OsocExperience.YES_NO_STUDENT_COACH.getParticipation())
        ));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void provided_valid_student_coach_is_added() {
        OsocExperience studentCoach = OsocExperience.YES_STUDENT_COACH;
        String optionId = "2";

        FormField formField = new FormField(QuestionKey.STUDENT_COACH, optionId);
        formField.setOptions(List.of(
                new Option("1", OsocExperience.YES_NO_STUDENT_COACH.getStudentCoach()),
                new Option("2", studentCoach.getStudentCoach())
        ));

        formField.addToStudent(student);

        assertEquals(studentCoach, student.getOsocExperience());
    }

    @Test
    public void provided_invalid_student_coach_throws_exception() {
        String studentCoach = "Maybe I want to be coach";

        FormField formField = new FormField(QuestionKey.STUDENT_COACH, "2");
        formField.setOptions(List.of(
                new Option("1", OsocExperience.YES_NO_STUDENT_COACH.getStudentCoach()),
                new Option("2", studentCoach)
        ));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void no_provided_student_coach_does_not_overwrite_experience() {
        OsocExperience osocExperience = OsocExperience.NONE;
        student.setOsocExperience(osocExperience);

        FormField formField = new FormField(QuestionKey.STUDENT_COACH, null);

        formField.addToStudent(student);

        assertEquals(osocExperience, student.getOsocExperience());
    }

}
