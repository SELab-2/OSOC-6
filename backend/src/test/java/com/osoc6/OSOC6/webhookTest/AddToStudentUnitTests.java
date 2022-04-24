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
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WORK_TYPE);
        formField.setValue(workType);

        formField.addToStudent(student);

        assertEquals(workType, student.getWorkType());
    }

    @Test
    public void provided_daytime_responsibilities_is_added() {
        String daytimeResponsibilities = "Taking care of my nana";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.DAY_RESPONSIBILITIES);
        formField.setValue(daytimeResponsibilities);

        formField.addToStudent(student);

        assertEquals(daytimeResponsibilities, student.getDaytimeResponsibilities());
    }

    @Test
    public void no_provided_daytime_responsibilities_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.DAY_RESPONSIBILITIES);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getDaytimeResponsibilities());
    }

    @Test
    public void add_birth_name_works() {
        String birthName = "birthname";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.BIRTH_NAME);
        formField.setValue(birthName);

        formField.addToStudent(student);

        assertEquals(birthName, student.getFirstName());
    }

    @Test
    public void add_last_name_works() {
        String lastName = "lastname";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LAST_NAME);
        formField.setValue(lastName);

        formField.addToStudent(student);

        assertEquals(lastName, student.getLastName());
    }

    @Test
    public void provided_callname_is_added() {
        String callName = "callname";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.CALL_NAME);
        formField.setValue(callName);

        formField.addToStudent(student);

        assertEquals(callName, student.getCallName());
    }

    @Test
    public void no_provided_callname_is_firstname_and_lastname() {
        String firstname = "firstname";
        String lastname = "lastname";
        student.setFirstName(firstname);
        student.setLastName(lastname);

        FormField formField = new FormField();
        formField.setKey(QuestionKey.CALL_NAME);

        formField.addToStudent(student);

        assertEquals(firstname + " " + lastname, student.getCallName());
    }

    @Test
    public void add_female_gender_works() {
        Gender gender = Gender.FEMALE;
        String optionId = "1";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.GENDER);
        formField.setValue(optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_male_gender_works() {
        Gender gender = Gender.MALE;
        String optionId = "2";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.GENDER);
        formField.setValue(optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_transgender_gender_works() {
        Gender gender = Gender.TRANSGENDER;
        String optionId = "3";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.GENDER);
        formField.setValue(optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_not_specified_gender_works() {
        Gender gender = Gender.NOT_SPECIFIED;
        String optionId = "4";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.GENDER);
        formField.setValue(optionId);
        setupGender(formField);

        formField.addToStudent(student);

        assertEquals(gender, student.getGender());
    }

    @Test
    public void add_invalid_gender_throws_exception() {
        String invalidGender = "Rubicks cube";
        String optionId = "1";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.GENDER);
        formField.setValue(optionId);
        formField.setOptions(List.of(new Option(optionId, invalidGender)));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void provided_pronouns_are_added() {
        String pronouns = "they/them";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WHICH_PRONOUNS);
        formField.setValue(pronouns);

        formField.addToStudent(student);

        assertEquals(pronouns, student.getPronouns());
    }

    @Test
    public void no_provided_pronouns_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WHICH_PRONOUNS);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getPronouns());
    }

    @Test
    public void provided_other_pronouns_are_added() {
        String pronouns = "mir/zir/zar";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_PRONOUNS);
        formField.setValue(pronouns);

        formField.addToStudent(student);

        assertEquals(pronouns, student.getPronouns());
    }

    @Test
    public void no_provided_other_pronouns_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_PRONOUNS);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getPronouns());
    }

    @Test
    public void add_most_fluent_language_works() {
        String language = "French";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WHICH_LANGUAGE);
        formField.setValue(language);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void provided_other_most_fluent_language_is_added() {
        String language = "Iraqw";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_LANGUAGE);
        formField.setValue(language);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void no_provided_other_language_does_not_overwrite_language() {
        String language = "French";
        student.setMostFluentLanguage(language);

        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_LANGUAGE);
        formField.setValue(null);

        formField.addToStudent(student);

        assertEquals(language, student.getMostFluentLanguage());
    }

    @Test
    public void add_read_not_write_english_proficiency_works() {
        String optionId = "1";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.READ_NOT_WRITE, student.getEnglishProficiency());
    }

    @Test
    public void add_simple_conversation_english_proficiency_works() {
        String optionId = "2";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.SIMPLE_CONVERSATION, student.getEnglishProficiency());
    }

    @Test
    public void add_expressive_english_proficiency_works() {
        String optionId = "3";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.EXPRESSIVE, student.getEnglishProficiency());
    }

    @Test
    public void add_extensive_english_proficiency_works() {
        String optionId = "4";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.EXTENSIVE, student.getEnglishProficiency());
    }

    @Test
    public void add_fluent_english_proficiency_works() {
        String optionId = "5";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        setupEnglishProficiency(formField);

        formField.addToStudent(student);

        assertEquals(EnglishProficiency.FLUENT, student.getEnglishProficiency());
    }

    @Test
    public void no_stars_in_english_proficiency_throws_exception() {
        String optionId = "1";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        formField.setOptions(List.of(new Option(optionId, "no stars in this string")));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void too_many_stars_in_english_proficiency_throws_exception() {
        String optionId = "1";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.RATE_ENGLISH);
        formField.setValue(optionId);
        formField.setOptions(List.of(new Option(optionId, "to many stars ★★★★★★ in this string")));

        assertThrows(WebhookException.class, () -> formField.addToStudent(student));
    }

    @Test
    public void add_phone_number_works() {
        String phoneNumber = "+32456742567864356";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.PHONE_NUMBER);
        formField.setValue(phoneNumber);

        formField.addToStudent(student);

        assertEquals(phoneNumber, student.getPhoneNumber());
    }

    @Test
    public void add_email_adress_works() {
        String email = "test@test.com";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.EMAIL_ADDRESS);
        formField.setValue(email);

        formField.addToStudent(student);

        assertEquals(email, student.getEmail());
    }

    @Test
    public void provided_upload_cv_as_list_of_map_is_added() {
        String url = "https://my.cv.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_CV);
        formField.setValue(listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getCurriculumVitaeURI());
    }

    @Test
    public void no_provided_upload_cv_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_CV);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getCurriculumVitaeURI());
    }

    @Test
    public void provided_link_cv_is_added() {
        String url = "https://my.cv.com";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_CV);
        formField.setValue(url);

        formField.addToStudent(student);

        assertEquals(url, student.getCurriculumVitaeURI());
    }

    @Test
    public void no_provided_link_cv_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_CV);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getCurriculumVitaeURI());
    }

    @Test
    public void provided_upload_portfolio_as_list_of_map_is_added() {
        String url = "https://my.portfolio.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_PORTFOLIO);
        formField.setValue(listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getPortfolioURI());
    }

    @Test
    public void no_provided_upload_portfolio_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_PORTFOLIO);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getPortfolioURI());
    }

    @Test
    public void provided_link_portfolio_is_added() {
        String url = "https://my.portfolio.com";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_PORTOFLIO);
        formField.setValue(url);

        formField.addToStudent(student);

        assertEquals(url, student.getPortfolioURI());
    }

    @Test
    public void no_provided_link_portfolio_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_PORTOFLIO);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getPortfolioURI());
    }

    @Test
    public void provided_upload_motivation_as_list_of_map_is_added() {
        String url = "https://my.motivation.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_MOTIVATION);
        formField.setValue(listMap);

        formField.addToStudent(student);

        assertEquals(url, student.getMotivationURI());
    }

    @Test
    public void no_provided_upload_motivation_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_MOTIVATION);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getMotivationURI());
    }

    @Test
    public void provided_link_motivation_is_added() {
        String url = "https://my.motivation";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_MOTIVATION);
        formField.setValue(url);

        formField.addToStudent(student);

        assertEquals(url, student.getMotivationURI());
    }

    @Test
    public void no_provided_link_motivation_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.LINK_MOTIVATION);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getMotivationURI());
    }

    @Test
    public void provided_written_motivation_is_added() {
        String motivation = "A 'long' text explaining why I would like to join OSOC.";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WRITE_MOTIVATION);
        formField.setValue(motivation);

        formField.addToStudent(student);

        assertEquals(motivation, student.getWrittenMotivation());
    }

    @Test
    public void no_provided_written_motivation_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.WRITE_MOTIVATION);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getWrittenMotivation());
    }

    @Test
    public void add_fun_fact_works() {
        String funFact = "A fun fact about me";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.FUN_FACT);
        formField.setValue(funFact);

        formField.addToStudent(student);

        assertEquals(funFact, student.getFunFact());
    }

    @Test
    public void all_non_other_studies_are_added() {
        List<String> studies = List.of("Backend development", "Design");
        List<String> optionIds = List.of("1", "3", "4");

        FormField formField = new FormField();
        formField.setKey(QuestionKey.STUDY);
        formField.setValue(optionIds);
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
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_STUDY);
        formField.setValue(study);

        formField.addToStudent(student);

        assertTrue(student.getStudies().contains(study));
    }

    @Test
    public void no_provided_other_study_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_STUDY);
        formField.setValue(null);

        formField.addToStudent(student);

        assertFalse(student.getStudies().contains(null));
        assertEquals(0, student.getStudies().size());
    }

    @Test
    public void provided_non_other_diploma_is_added() {
        String diploma = "Bachelor of Science";
        String optionId = "1";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.DIPLOMA);
        formField.setValue(List.of(optionId));
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

        FormField formField = new FormField();
        formField.setKey(QuestionKey.DIPLOMA);
        formField.setValue(List.of(optionId));
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
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_DIPLOMA);
        formField.setValue(diploma);

        formField.addToStudent(student);

        assertEquals(diploma, student.getCurrentDiploma());
    }

    @Test
    public void no_provided_other_diploma_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_DIPLOMA);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getCurrentDiploma());
    }

    @Test
    public void provided_total_degree_years_is_added() {
        Integer totalDegreeYears = 3;
        FormField formField = new FormField();
        formField.setKey(QuestionKey.TOTAL_DEGREE_YEARS);
        formField.setValue(totalDegreeYears);

        formField.addToStudent(student);

        assertEquals(totalDegreeYears, student.getDurationCurrentDegree());
    }

    @Test
    public void no_provided_total_degree_years_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.TOTAL_DEGREE_YEARS);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getDurationCurrentDegree());
    }

    @Test
    public void provided_current_degree_year_is_added() {
        String currentDegreeYear = "second year";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.CURRENT_DEGREE_YEAR);
        formField.setValue(currentDegreeYear);

        formField.addToStudent(student);

        assertEquals(currentDegreeYear, student.getYearInCourse());
    }

    @Test
    public void no_provided_current_degree_year_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.CURRENT_DEGREE_YEAR);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getYearInCourse());
    }

    @Test
    public void provided_college_name_is_added() {
        String collegeName = "UGent";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.COLLEGE_NAME);
        formField.setValue(collegeName);

        formField.addToStudent(student);

        assertEquals(collegeName, student.getInstitutionName());
    }

    @Test
    public void no_provided_college_name_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.COLLEGE_NAME);
        formField.setValue(null);

        formField.addToStudent(student);

        assertNotNull(student.getInstitutionName());
    }

    @Test
    public void all_non_other_roles_are_added() {
        List<String> roles = List.of("Backend developer", "Photographer");
        List<String> optionIds = List.of("1", "2", "4");

        FormField formField = new FormField();
        formField.setKey(QuestionKey.ROLES);
        formField.setValue(optionIds);
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
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_ROLE);
        formField.setValue(role);

        formField.addToStudent(student);

        assertTrue(student.getSkills().contains(role));
    }

    @Test
    public void no_provided_other_role_does_not_add_null() {
        FormField formField = new FormField();
        formField.setKey(QuestionKey.OTHER_ROLE);
        formField.setValue(null);

        formField.addToStudent(student);

        assertFalse(student.getSkills().contains(null));
        assertEquals(0, student.getSkills().size());
    }

    @Test
    public void add_best_skill_works() {
        String bestSkill = "My best skill";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.BEST_SKILL);
        formField.setValue(bestSkill);

        formField.addToStudent(student);

        assertEquals(bestSkill, student.getBestSkill());
    }

    @Test
    public void valid_osoc_participation_is_added() {
        OsocExperience osocExperience = OsocExperience.NONE;
        String optionId = "1";

        FormField formField = new FormField();
        formField.setKey(QuestionKey.OSOC_EXPERIENCE);
        formField.setValue(optionId);
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

        FormField formField = new FormField();
        formField.setKey(QuestionKey.OSOC_EXPERIENCE);
        formField.setValue("1");
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

        FormField formField = new FormField();
        formField.setKey(QuestionKey.STUDENT_COACH);
        formField.setValue(optionId);
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

        FormField formField = new FormField();
        formField.setKey(QuestionKey.STUDENT_COACH);
        formField.setValue("2");
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

        FormField formField = new FormField();
        formField.setKey(QuestionKey.STUDENT_COACH);
        formField.setValue(null);

        formField.addToStudent(student);

        assertEquals(osocExperience, student.getOsocExperience());
    }

}
