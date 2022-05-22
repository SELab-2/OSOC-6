package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.entities.Assignment;
import com.osoc6.OSOC6.entities.Project;
import com.osoc6.OSOC6.entities.ProjectSkill;
import com.osoc6.OSOC6.entities.student.Student;
import com.osoc6.OSOC6.dto.AssignmentDTO;
import com.osoc6.OSOC6.repository.AssignmentRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.repository.ProjectSkillRepository;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Assignment} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachAssignmentEndpointTests extends TestFunctionProvider<Assignment, Long, AssignmentRepository> {

    /**
     * The repository which saves, searches, ... {@link Student} in the database.
     */
    @Autowired
    private StudentRepository studentRepository;

    /**
     * The repository which saves, searches, ... {@link Assignment} in the database.
     */
    @Autowired
    private AssignmentRepository assignmentRepository;

    /**
     * The repository which saves, searches, ... {@link Project} in the database.
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * The repository which saves, searches, ... {@link ProjectSkill} in the database.
     */
    @Autowired
    private ProjectSkillRepository projectSkillRepository;

    /**
     * Entity links, needed to get the link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Test student that is loaded before every test.
     */
    private final Student testStudent = TestEntityProvider.getBaseStudentNonFormattedPronouns(this);

    /**
     * Sample project that gets loaded before every test.
     */
    private final Project testProject = TestEntityProvider.getBaseProject1(this);

    /**
     * ProjectSkill that gets loaded before every test.
     */
    private final ProjectSkill projectSkill = TestEntityProvider.getBaseProjectSkill1(testProject);

    /**
     * Sample {@link Assignment} that gets loaded before every test.
     */
    private final Assignment testAssignment = TestEntityProvider
            .getBaseValidAssignment1(getCoachUser(), testStudent, projectSkill);

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "A reason was asked but I have non. He's just the only student";

    public CoachAssignmentEndpointTests() {
        super("/" + DumbledorePathWizard.ASSIGNMENT_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final Assignment entity) {
        return entity.getId();
    }

    @Override
    public AssignmentRepository get_repository() {
        return assignmentRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        projectRepository.save(testProject);

        projectSkillRepository.save(projectSkill);

        studentRepository.save(testStudent);

        assignmentRepository.save(testAssignment);
    }

    @Override
    public void removeSetUpRepository() {
        assignmentRepository.deleteAll();

        studentRepository.deleteAll();

        projectSkillRepository.deleteAll();

        projectRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public Assignment create_entity() {
        Assignment assignment = TestEntityProvider
                .getBaseValidAssignment2(getCoachUser(), testStudent, projectSkill);
        assignment.setReason(TEST_STRING);
        return assignment;
    }

    @Override
    public Map<String, String> change_entity(final Assignment startEntity) {
        return Map.of("reason", TEST_STRING);
    }

    @Override
    public String transform_to_json(final Assignment entity) {
        AssignmentDTO helper = new AssignmentDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    // ======================== tests ========================

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_same_edition_assignment_works_1() throws Exception {
        perform_get(getEntityPath() + "/" + testAssignment.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_same_edition_assignment_works_2() throws Exception {
        perform_get(getEntityPath() + "/" + testAssignment.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_other_edition_assignment_fails() throws Exception {
        perform_get(getEntityPath() + "/" + testAssignment.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_assignment_fails() throws Exception {
        perform_get(getEntityPath()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_own_assignment_works() throws Exception {
        perform_patch(getEntityPath() + "/" + testAssignment.getId(), change_entity(testAssignment))
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(TEST_STRING));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_own_assignment_leaves_time_unchanged() throws Exception {
        Map<String, String> patchMap = Map.of(
                "timestamp", Instant.now().plus(3, ChronoUnit.DAYS).toString()
        );

        String timestampString = testAssignment.getTimestamp().toInstant().toString();

        perform_patch(getEntityPath() + "/" + testAssignment.getId(), patchMap)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(timestampString.substring(0, timestampString.length() - 1)));
    }

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_other_assignment_fails() throws Exception {
        perform_patch(getEntityPath() + "/" + testAssignment.getId(), change_entity(testAssignment))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_own_assignment_works() throws Exception {
        perform_delete_with_id(getEntityPath(), testAssignment.getId())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_other_assignment_fails() throws Exception {
        perform_delete_with_id(getEntityPath(), testAssignment.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_illegal_is_not_fount() throws Exception {
        perform_delete_with_id(getEntityPath(), getILLEGAL_ID())
                .andExpect(status().isNotFound());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_own_assignment_works() throws Exception {
        perform_post(getEntityPath(), create_entity())
                .andExpect(status().isCreated())
                .andExpect(string_to_contains_string(TEST_STRING));
    }

    @Test
    @WithUserDetails(value = MATCHING_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_other_assignment_fails() throws Exception {
        perform_post(getEntityPath(), create_entity())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_student_works() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_STUDENT_PATH,
                new String[]{"studentId", "valid"},
                new String[]{testStudent.getId().toString(), Boolean.toString(true)})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_student_no_results_on_invalid_student() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_STUDENT_PATH,
                new String[]{"studentId", "valid"},
                new String[]{Long.toString(getILLEGAL_ID()), Boolean.toString(true)})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_student_gives_no_access() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_STUDENT_PATH,
                new String[]{"studentId", "valid"},
                new String[]{testStudent.getId().toString(), Boolean.toString(true)})
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_project_works() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_PROJECT_SKILL_PATH,
                new String[]{"projectSkillId", "valid"},
                new String[]{projectSkill.getId().toString(), Boolean.toString(true)})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_project_no_results_on_invalid_student() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_PROJECT_SKILL_PATH,
                new String[]{"projectSkillId", "valid"},
                new String[]{Long.toString(getILLEGAL_ID()), Boolean.toString(true)})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testAssignment.getReason()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_valid_on_project_gives_no_access() throws Exception {
        perform_queried_get(getEntityPath()
                        + "/search/" + DumbledorePathWizard.ASSIGNMENT_VALID_OF_PROJECT_SKILL_PATH,
                new String[]{"projectSkillId", "valid"},
                new String[]{projectSkill.getId().toString(), Boolean.toString(true)})
                .andExpect(status().isForbidden());
    }

}
