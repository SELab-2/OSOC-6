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
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

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
    private final Project project1 = new Project("Facebook", edition, null, user1);

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project("Instagram", edition, null, user1);

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
     * Since the UserRepository is secured, we need to do this to save users.
     */
    public void initialize_security() {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);
    }

    /**
     * After the users are saved, the context can be cleared.
     */
    public void remove_security() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Add two test projects, a user and an edition to the database.
     */
    @Override
    public void setUpRepository() {
        initialize_security();

        organisationRepository.save(organisation);

        edition.setActive(true);
        edition.setName("OSOC2022");
        edition.setYear(2022);

        editionRepository.save(edition);

        initialize_security();
        user1.setEmail("lukas@gmail.com");
        user1.setCallName("Lukas");
        user1.setUserRole(UserRole.ADMIN);
        user1.setPassword("mettn");

        userRepository.save(user1);

        projectRepository.save(project1);
        projectRepository.save(project2);

        remove_security();
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        initialize_security();
        projectRepository.deleteAll();

        if (editionRepository.existsById(edition.getId())) {
            editionRepository.deleteById(edition.getId());
        }
        if (userRepository.existsById(user1.getId())) {
            userRepository.deleteById(user1.getId());
        }
        if (organisationRepository.existsById(organisation.getId())) {
            organisationRepository.deleteById(organisation.getId());
        }
        remove_security();
    }

    @Override
    public final Project create_entity() {
        // Setting organisation to null makes more tests pass, but kind of defeats the purpose of testing...
        return new Project(TEST_STRING, edition, organisation, user1);
    }

    @Override
    public final Project change_entity(final Project project) {
        Project changed = new Project(project.getName(),
                           project.getEdition(),
                           project.getPartner(),
                           project.getCreator());
        changed.setName(TEST_STRING);
        return changed;
    }

    @Override
    public final ProjectRepository get_repository() {
        return projectRepository;
    }

    @Override
    public final Long get_id(final Project project) {
        return project.getId();
    }

    @Override
    public final ResultActions perform_post(final String path, final Project entity) throws Exception {
        return getMockMvc().perform(post(PROJECTS_PATH)
                .content(projectToString(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    @Override
    public final ResultActions perform_put(final String path, final Project entity) throws Exception {
        return getMockMvc().perform(put(path)
                .content(projectToString(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     *
     * @param entity the Project of which we want the JSON
     * @return a string of the JSON representation with the edition and creator replaced by URI's instead of more JSON's
     */
    public String projectToString(final Project entity) {
        String json = Util.asJsonStringNoEmptyId(entity);

        String editionToUrl = entityLinks.linkToItemResource(Edition.class, edition.getId().toString()).getHref();
        String userToUrl = entityLinks.linkToItemResource(UserEntity.class, user1.getId().toString()).getHref();

        json = json.replaceAll("creator\":.*},", "creator\":\"" + userToUrl + "\",")
                .replaceAll("edition\":.*},", "edition\":\"" + editionToUrl + "\",");

        return json;
    }
}

