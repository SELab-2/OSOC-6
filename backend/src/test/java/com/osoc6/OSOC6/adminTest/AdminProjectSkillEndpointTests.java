package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
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

/**
 * Class testing the integration of {@link ProjectSkill} with an admin access level.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AdminProjectSkillEndpointTests extends AdminEndpointTest<ProjectSkill, Long, ProjectSkillRepository> {

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
     * Entity links, needed to get to link of an entity.
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
    private final ProjectSkill skill = TestEntityProvider.getBaseProjectSkill1(testProject);

    /**
     * The actual path projects are served on, with '/' as prefix.
     */
    private static final String PROJECT_SKILL_PATH = "/" + DumbledorePathWizard.PROJECT_SKILL_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Walking with a banana in my ear";

    public AdminProjectSkillEndpointTests() {
        super(PROJECT_SKILL_PATH, TEST_STRING);
    }

    /**
     * Setup repos for all tests.
     */
    @Override
    public void setUpRepository() {
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

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_entities_succeeds() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(skill.getName()));
    }
}

