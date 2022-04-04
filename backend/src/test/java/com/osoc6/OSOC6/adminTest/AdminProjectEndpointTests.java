package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link Project}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminProjectEndpointTests extends AdminEndpointTest<Project, Long, ProjectRepository> {

    /**
     * The repository which saves, searches, ... Projects in the database
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = new Project();

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project();

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

        project1.setName("New chip");
        project1.setEdition(this.getBaseUserEdition());
        project1.setPartnerName("Intel");
        project1.setCreator(getAdminUser());

        project2.setName("Instagram");
        project2.setEdition(this.getBaseUserEdition());
        project2.setPartnerName("Meta");
        project2.setCreator(getAdminUser());

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
        return new Project(TEST_STRING, this.getBaseUserEdition(), "A new organisation", getAdminUser());
    }

    @Override
    public final Map<String, String> change_entity(final Project project) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);
        return patchMap;
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
        String json = Util.asJsonStringNoEmptyId(entity);

        String editionToUrl = entityLinks.linkToItemResource(Edition.class, this.getBaseUserEdition().getId().toString()).getHref();
        String userToUrl = entityLinks.linkToItemResource(UserEntity.class,
                getAdminUser().getId().toString()).getHref();

        json = json.replaceAll("creator\":.*},", "creator\":\"" + userToUrl + "\",")
                .replaceAll("edition\":.*},", "edition\":\"" + editionToUrl + "\",");

        return json;
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_entities_succeeds() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(project1.getName()))
                .andExpect(string_to_contains_string(project2.getName()));
    }
}

