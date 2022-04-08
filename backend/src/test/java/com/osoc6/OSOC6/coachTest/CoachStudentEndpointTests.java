package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.dto.StudentDTO;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Student} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachStudentEndpointTests extends TestFunctionProvider<Student, Long, StudentRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private StudentRepository studentRepository;

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String STUDENTS_PATH = "/" + DumbledorePathWizard.STUDENT_PATH;

    /**
     * A test user to allowing us to write test easily.
     */
    private final Student testStudent = Student.builder()
            .email("kasper@mail.com")
            .additionalStudentInfo("He likes it like that")
            .bestSkill("Finding out the Spring ways")
            .currentDiploma("Master")
            .educationLevel("higher level")
            .englishProficiency(EnglishProficiency.FLUENT)
            .firstName("Kasper")
            .lastName("Demeyere")
            .callName("Kasper Demeyere")
            .gender(Gender.MALE)
            .institutionName("Ghent University")
            .mostFluentLanguage("Dutch")
            .osocExperience(OsocExperience.YES_NO_STUDENT_COACH)
            .phoneNumber("+324992772")
            .pronounsType(PronounsType.HE)
            .writtenMotivation("I love to Spring Spring in java Spring!")
            .yearInCourse("3")
            .durationCurrentDegree(5)
            .edition(getBaseUserEdition())
            .motivationURI("www.I-like-bananas.com")
            .curriculumVitaeURI("www.my-life-in-ghent.com")
            .writtenMotivation("www.I-just-like-spring.com")
            .build();

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Bananas are my signature dish";

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    public CoachStudentEndpointTests() {
        super(STUDENTS_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final Student entity) {
        return entity.getId();
    }

    @Override
    public StudentRepository get_repository() {
        return studentRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        studentRepository.save(testStudent);
    }

    @Override
    public void removeSetUpRepository() {
        studentRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public Student create_entity() {
        return Student.builder()
                .email("jitse@mail.com")
                .additionalStudentInfo(TEST_STRING)
                .bestSkill("standing on hands")
                .currentDiploma("Master")
                .educationLevel("Lower level")
                .englishProficiency(EnglishProficiency.FLUENT)
                .firstName("Jitse")
                .lastName("De Smet")
                .callName("Jitse De smet")
                .gender(Gender.MALE)
                .institutionName("Ghent University")
                .mostFluentLanguage("Dutch")
                .osocExperience(OsocExperience.NONE)
                .phoneNumber("+324982672")
                .pronounsType(PronounsType.HE)
                .writtenMotivation("I love to code!")
                .yearInCourse("3")
                .durationCurrentDegree(5)
                .edition(getBaseUserEdition())
                .motivationURI("www.ILikeApples.com")
                .curriculumVitaeURI("www.my-life-in-bel-air.com")
                .writtenMotivation("www.I-just-want-it.com")
                .build();
    }

    @Override
    public Map<String, String> change_entity(final Student startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("additionalStudentInfo", TEST_STRING);
        return changeMap;
    }

    /**
     * Transforms a Student to his correct String representation.
     * @param entity entity to transform
     * @return the string representation
     */
    @Override
    public String transform_to_json(final Student entity) {
        StudentDTO helper = new StudentDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    // ============================= Start tests =============================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_returns_all_students_of_same_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_does_not_contain_students_of_different_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_student_by_id_of_same_edition_as_user_works() throws Exception {
        perform_get(getEntityPath() + "/" + testStudent.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_student_by_id_of_different_edition_as_user_fails() throws Exception {
        perform_get(getEntityPath() + "/" + testStudent.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_fails() throws Exception {
        Student entity = create_entity();

        perform_post(getEntityPath(), entity)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_student_fails() throws Exception {
        Student entity = get_random_repository_entity();
        perform_delete_with_id(getEntityPath(), entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        Student entity = get_random_repository_entity();

        perform_patch(getEntityPath() + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void query_with_correct_edition_has_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition"},
                new String[]{getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void query_with_wrong_edition_is_forbidden() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition"},
                new String[]{getBaseUserEdition().getId().toString()})
                .andExpect(status().isForbidden());
    }
}
