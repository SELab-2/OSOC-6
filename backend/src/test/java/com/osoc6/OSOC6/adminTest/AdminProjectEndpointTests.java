package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.dto.ProjectDTO;
import com.osoc6.OSOC6.repository.ProjectRepository;
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
 * Class testing the integration of {@link Project} with an admin access level.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AdminProjectEndpointTests extends AdminEndpointTest<Project, Long, ProjectRepository> {

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
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = TestEntityProvider.getBaseProject1(this);

    /**
     * The actual path projects are served on, with '/' as prefix.
     */
    private static final String PROJECTS_PATH = "/" + DumbledorePathWizard.PROJECTS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "OSOC-tool";

    public AdminProjectEndpointTests() {
        super(PROJECTS_PATH, TEST_STRING);
    }

    /**
     * Add two test projects, a user and an edition to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        projectRepository.save(project1);
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
        Project project = TestEntityProvider.getBaseProject2(this);
        project.setName(TEST_STRING);
        return project;
    }

    @Override
    public final Map<String, String> change_entity(final Project project) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public final ProjectRepository get_repository() {
        return projectRepository;
    }

    @Override
    public final Long get_id(final Project project) {
        return project.getId();
    }

    /**
     * Transforms a Project-JSON to its String-representation.
     * @param entity entity to transform
     * @return the string representation
     */
    @Override
    public String transform_to_json(final Project entity) {
        ProjectDTO helper = new ProjectDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_entities_succeeds() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(project1.getName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_correct_edition_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH,
                new String[]{"edition"},
                new String[]{getBaseActiveUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(project1.getName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_false_edition_works_not_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH,
                new String[]{"edition"},
                new String[]{Long.toString(getILLEGAL_ID())})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(project1.getName()));
    }
}

