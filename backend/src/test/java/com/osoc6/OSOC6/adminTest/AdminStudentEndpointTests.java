package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.dto.StudentDTO;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link com.osoc6.OSOC6.database.models.Edition} as an admin.
 */
public final class AdminStudentEndpointTests extends AdminEndpointTest<Student, Long, StudentRepository> {

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
    private final Student testStudent = TestEntityProvider.getBaseStudentHe(this);

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

    public AdminStudentEndpointTests() {
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
        Student student = TestEntityProvider.getBaseStudentOther(this);
        student.setAdditionalStudentInfo(TEST_STRING);
        return student;
    }

    @Override
    public Map<String, String> change_entity(final Student startEntity) {
        return Map.of("additionalStudentInfo", TEST_STRING);
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

    // ============================= Additional Tests =============================

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_edition_works_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{testStudent.getCallName(), getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));

        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{"banana" + testStudent.getCallName() + "apple", getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_callName_starting_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{testStudent.getCallName().substring(0, testStudent.getCallName().length() - 5),
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_callName_endsWith_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{testStudent.getCallName().substring(5, testStudent.getCallName().length()),
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_false_edition_works_not_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{testStudent.getCallName(), Long.toString(getILLEGAL_ID())})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_no_args_has_no_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{},
                new String[]{})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_first_name_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"firstName", "edition"},
                new String[]{testStudent.getFirstName(), getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_first_name_works_no_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"firstName", "edition"},
                new String[]{"apple" + testStudent.getFirstName() + "banana",
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_all_works_with_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition"},
                new String[]{getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_gibberish_param_works_with_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "cbilcblcjbh"},
                new String[]{getBaseUserEdition().getId().toString(), "cbjbhcjb"})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void student_with_weird_pronouns_is_handled() throws Exception {
        Student entity = get_random_repository_entity();
        perform_patch(getEntityPath() + "/" + get_id(entity), Map.of("pronouns", "hom/mam/tam"))
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string("\"pronouns\" : \"hom/mam/tam\""));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_on_reason_gives_result_1() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "skill"},
                new String[]{getBaseUserEdition().getId().toString(), "on a nice"})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_on_reason_gives_result_2() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "skill"},
                new String[]{getBaseUserEdition().getId().toString(), "whilst thinking about"})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_on_reason_gives_no_result() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "skill"},
                new String[]{getBaseUserEdition().getId().toString(), "standing on hands"})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }
}
