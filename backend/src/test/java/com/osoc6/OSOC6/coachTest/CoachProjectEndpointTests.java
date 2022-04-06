package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
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
 * Class testing the integration of {@link Project} with an coach access level.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachProjectEndpointTests extends TestFunctionProvider<Project, Long, ProjectRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private EditionRepository editionRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample edition that gets loaded before every test.
     */
    private final Edition edition = new Edition("Another edition", 2019, false);

    /**
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = new Project("New chip", edition, "Intel", getAdminUser());

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project("Instagram", getBaseUserEdition(), "Meta", getAdminUser());

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "OSOC-tool";

    /**
     * The actual path projects are served on, with '/' as prefix.
     */
    private static final String PROJECT_PATH = "/" + DumbledorePathWizard.PROJECTS_PATH;

    public CoachProjectEndpointTests() {
        super(PROJECT_PATH, TEST_STRING);
    }

    @Override
    public final Long get_id(final Project entity) {
        return entity.getId();
    }

    @Override
    public final ProjectRepository get_repository() {
        return projectRepository;
    }

    /**
     * Add two test projects to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        editionRepository.save(edition);

        projectRepository.save(project1);
        projectRepository.save(project2);
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        projectRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public final Project create_entity() {
        return new Project(TEST_STRING, getBaseUserEdition(), "A test organisation", getAdminUser());
    }

    @Override
    public final Map<String, String> change_entity(final Project startEntity) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);
        return patchMap;
    }

    /**
     * Transforms a Project-JSON to its String-representation.
     * @param entity entity to transform
     * @return the string representation
     */
    @Override
    public String transform_to_json(final Project entity) {
        String json = Util.asJsonString(entity);

        String editionToUrl = entityLinks.linkToItemResource(Edition.class,
                entity.getEdition().getId().toString()).getHref();
        String userToUrl = entityLinks.linkToItemResource(UserEntity.class,
                entity.getCreator().getId().toString()).getHref();

        json = json.replaceAll("creator\":.*},", "creator\":\"" + userToUrl + "\",")
                .replaceAll("edition\":.*},", "edition\":\"" + editionToUrl + "\",");

        return json;
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_returns_all_projects_of_same_edition_as_user() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(project2.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_does_not_contain_projects_of_different_edition_as_user() throws Exception {
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
