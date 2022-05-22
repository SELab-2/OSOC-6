package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.entities.Project;
import com.osoc6.OSOC6.entities.ProjectSkill;
import com.osoc6.OSOC6.dto.ProjectSkillDTO;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.repository.ProjectSkillRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link ProjectSkill} with a coach access level.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachProjectSkillEndpointTests extends TestFunctionProvider<ProjectSkill, Long, ProjectSkillRepository> {
    /**
     * The repository which saves, searches, ... {@link ProjectSkill} in the database.
     */
    @Autowired
    private ProjectSkillRepository projectSkillRepository;

    /**
     * The repository which saves, searches, ... {@link Project} in the database.
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Entity links, needed to get the link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample project that gets loaded before every test.
     */
    private final Project testProject = TestEntityProvider.getBaseProject1(this);

    /**
     * Sample projectSkill that gets loaded before every test.
     */
    private final ProjectSkill skill = new ProjectSkill("Walk on water", testProject, "just to be with you!");

    /**
     * The actual path project skills are served on, with '/' as prefix.
     */
    private static final String PROJECT_SKILL_PATH = "/" + DumbledorePathWizard.PROJECT_SKILL_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Walking with a banana in my ear";

    public CoachProjectSkillEndpointTests() {
        super(PROJECT_SKILL_PATH, TEST_STRING);
    }

    /**
     * Setup the repos for all tests.
     */
    @Override
    public final void setUpRepository() {
        setupBasicData();

        projectRepository.save(testProject);

        projectSkillRepository.save(skill);
    }

    @Override
    public final void removeSetUpRepository() {
        projectSkillRepository.deleteAll();

        projectRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public final Long get_id(final ProjectSkill entity) {
        return entity.getId();
    }

    @Override
    public final ProjectSkillRepository get_repository() {
        return projectSkillRepository;
    }

    @Override
    public final ProjectSkill create_entity() {
        return new ProjectSkill(TEST_STRING, testProject, "It's fun? ... ???");
    }

    @Override
    public final Map<String, String> change_entity(final ProjectSkill startEntity) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public final String transform_to_json(final ProjectSkill entity) {
        ProjectSkillDTO helper = new ProjectSkillDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    // ============================= Start Tests =============================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_returns_all_projectsSkill_of_same_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(skill.getName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_does_not_contain_projectsSkills_of_different_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_not_to_contains_string(skill.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_projectSkill_by_id_of_same_edition_as_user_works() throws Exception {
        perform_get(getEntityPath() + "/" + skill.getId())
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(skill.getName()));
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_projectSkill_by_id_of_different_edition_as_user_fails() throws Exception {
        perform_get(getEntityPath() + "/" + skill.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_fails() throws Exception {
        ProjectSkill entity = create_entity();

        perform_post(getEntityPath(), entity)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_projectSkill_fails() throws Exception {
        ProjectSkill entity = get_random_repository_entity();
        perform_delete_with_id(getEntityPath(), entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        ProjectSkill entity = get_random_repository_entity();

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
