package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
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
     * The repository which saves, searches, ... Editions in the database
     */
    @Autowired
    private EditionRepository editionRepository;

    /**
     * The repository which saves, searches, ... Organisations in the database
     */
    @Autowired
    private OrganisationRepository organisationRepository;

    /**
     * The repository which saves, searches, ... Users in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample edition that gets loaded before every test.
     */
    private final Edition edition = new Edition();

    /**
     * Sample project creator that gets loaded before every test.
     */
    private final UserEntity user1 = new UserEntity("test@mail.com", "Lukas", UserRole.ADMIN, "password");

    /**
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = new Project();

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project();

    /**
     * Sample organisation that gets loaded before every test.
     */
    private final Organisation organisation = new Organisation("Experience what's inside", "Intel", null);

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
        organisationRepository.save(organisation);

        edition.setActive(true);
        edition.setName("OSOC2022");
        edition.setYear(2022);

        editionRepository.save(edition);

        user1.setEmail("lukas@gmail.com");
        user1.setCallName("Lukas");
        user1.setUserRole(UserRole.ADMIN);
        user1.setPassword("mettn");

        userRepository.save(user1);

        project1.setName("Facebook");
        project1.setEdition(edition);
        project1.setPartner(null);
        project1.setCreator(user1);

        project2.setName("Instagram");
        project2.setEdition(edition);
        project2.setPartner(organisation);
        project2.setCreator(user1);

        projectRepository.save(project1);
        projectRepository.save(project2);

        organisationRepository.flush();
        projectRepository.flush();
    }

    @Test
    @Transactional
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void test_if_works() {
        try {
            SecurityContext securityContext = new SecurityContextImpl();
            securityContext.setAuthentication(
                    new TestingAuthenticationToken(null, null, "ADMIN"));
            SecurityContextHolder.setContext(securityContext);
            List<Project> projects = projectRepository.findByName(project2.getName());
            List<Organisation> organisations = organisationRepository.findByName(organisation.getName());
            organisations.contains(organisation);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }


    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
//        projectRepository.deleteAll();
//
//        organisationRepository.deleteAll();
//
//        userRepository.deleteAll();
//
//        editionRepository.deleteAll();
    }

    @Override
    public final Project create_entity() {
        // Setting organisation to null makes more tests pass, but kind of defeats the purpose of testing...
        return new Project(TEST_STRING, edition, null, user1);
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

        String editionToUrl = entityLinks.linkToItemResource(Edition.class, edition.getId().toString()).getHref();
        String userToUrl = entityLinks.linkToItemResource(UserEntity.class, user1.getId().toString()).getHref();

        json = json.replaceAll("creator\":.*},", "creator\":\"" + userToUrl + "\",")
                .replaceAll("edition\":.*},", "edition\":\"" + editionToUrl + "\",");

        return json;
    }

}

