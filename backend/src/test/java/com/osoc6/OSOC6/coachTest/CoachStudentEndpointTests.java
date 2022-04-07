package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.StudentJsonHelper;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Project;
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

import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Student} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachStudentEndpointTests extends TestFunctionProvider<Student, Long, StudentRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private StudentRepository studentRepository;

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String STUDENTS_PATH = "/" + DumbledorePathWizard.STUDENT_PATH;

    private final Student studentKasper = Student.builder()
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
    public Long get_id(Student entity) {
        return entity.getId();
    }

    @Override
    public StudentRepository get_repository() {
        return studentRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        studentRepository.save(studentKasper);
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
    public Map<String, String> change_entity(Student startEntity) {
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
        StudentJsonHelper helper = new StudentJsonHelper(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    // ============================= Start tests =============================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_returns_all_students_of_same_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_does_not_contain_projects_of_different_edition_as_user() throws Exception {
        // An outsider in TestFunctionProvider would be nice here.
        base_get_all_entities_succeeds()
                .andExpect(content().string(not(containsString(project1.getName()))));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_project_by_id_of_same_edition_as_user_works() throws Exception {
        perform_get(getEntityPath() + "/" + project2.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(project2.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_project_by_id_of_different_edition_as_user_fails() throws Exception {
        perform_get(getEntityPath() + "/" + project1.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_fails() throws Exception {
        Project entity = create_entity();

        perform_post(getEntityPath(), entity)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_project_fails() throws Exception {
        Project entity = get_random_repository_entity();
        perform_delete_with_id(getEntityPath(), entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        Project entity = get_random_repository_entity();

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
}
