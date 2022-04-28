package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.ProjectSkill;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.dto.AssignmentDTO;
import com.osoc6.OSOC6.repository.AssignmentRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.repository.ProjectSkillRepository;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Assignment} with an admin access level.
 */
public final class AdminAssignmentEndpointTests extends AdminEndpointTest<Assignment, Long, AssignmentRepository> {

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
     * The repository which saves, searches, ... {@link Project} in the database
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * The repository which saves, searches, ... {@link ProjectSkill} in the database
     */
    @Autowired
    private ProjectSkillRepository projectSkillRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Test student that is loaded before every test.
     */
    private final Student testStudent = TestEntityProvider.getBaseStudentHe(this);

    /**
     * Sample project 1 that gets loaded before every test.
     */
    private final Project project1 = TestEntityProvider.getBaseProject1(this);

    /**
     * First Skill for project that gets loaded before every test.
     */
    private final ProjectSkill projectSkill1 = TestEntityProvider.getBaseProjectSkill1(project1);

    /**
     * Second Skill for project that gets loaded before every test.
     */
    private final ProjectSkill projectSkill2 = TestEntityProvider.getBaseProjectSkill1(project1);

    /**
     * Sample {@link Assignment} that gets loaded before every test.
     */
    private final Assignment testAssignment = TestEntityProvider.getBaseSuggestionAssignment(getAdminUser(),
            testStudent, projectSkill1);

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "A reason was asked but I have non. He's just the only student";

    public AdminAssignmentEndpointTests() {
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

        projectRepository.save(project1);

        projectSkillRepository.save(projectSkill1);
        projectSkillRepository.save(projectSkill2);

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
                .getBaseNonSuggestionAssignment(getAdminUser(), testStudent, projectSkill1);
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

    // ======================== Additional tests ========================

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_matching_query_over_assignment_reason_works() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"freeText", "edition"},
                new String[]{testAssignment.getReason(),
                        getBaseActiveUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_non_matching_query_over_assignment_reason_works() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"freeText", "edition"},
                new String[]{"apple" + testAssignment.getReason() + "banana",
                        getBaseActiveUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_not_matching_query_conflict_works() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_CONFLICT_PATH,
                new String[]{"edition"},
                new String[]{getBaseActiveUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_matching_query_conflict_works() throws Exception {
        perform_post(getEntityPath(), TestEntityProvider
                .getBaseNonSuggestionAssignment(getCoachUser(), testStudent, projectSkill2));

        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_CONFLICT_PATH,
                new String[]{"edition"},
                new String[]{getBaseActiveUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_conflict_no_edition_works() throws Exception {
        perform_post(getEntityPath(), TestEntityProvider
                .getBaseNonSuggestionAssignment(getCoachUser(), testStudent, projectSkill2));

        perform_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_CONFLICT_PATH)
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_unmatched_works_results_when_true() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH
                        + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "unmatched"},
                new String[]{getBaseActiveUserEdition().getId().toString(), Boolean.toString(true)})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testStudent.getBestSkill()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_unmatched_works_results_when_false() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH
                        + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition", "unmatched"},
                new String[]{getBaseActiveUserEdition().getId().toString(), Boolean.toString(false)})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testStudent.getBestSkill()));
    }
}
