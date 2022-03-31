package com.osoc6.OSOC6.adminTest;

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
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;

/**
 * Class testing the integration of {@link Project}.
 */
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
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = new Project();

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project();

    /**
     * Sample project creator that gets loaded before every test.
     */
    private final UserEntity user1 = new UserEntity();

    /**
     * Sample project creator that gets loaded before every test.
     */
    private final UserEntity user2 = new UserEntity();

    /**
     * Sample edition that gets loaded before every test.
     */
    private final Edition edition = new Edition();

    /**
     * Sample organisation that gets loaded before every test.
     */
    private final Organisation organisation = new Organisation();

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
     * Since the UserRepository iss secured, we need to do this to save users
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
    @BeforeEach
    public void setUpRepository() {
        initialize_security();

        user1.setEmail("lukas@gmail.com");
        user1.setCallName("Lukas");
        user1.setUserRole(UserRole.ADMIN);
        user1.setPassword("mettn");

        user2.setEmail("kenny@gmail.com");
        user2.setCallName("Kenny");
        user2.setUserRole(UserRole.COACH);
        user2.setPassword("bougie");

        userRepository.save(user1);
        userRepository.save(user2);

        edition.setActive(true);
        edition.setName("OSOC2022");
        edition.setYear(2022);
        editionRepository.save(edition);

        project1.setName("Instagram");
        project1.setEdition(edition);
        project1.setCreator(user1);
        projectRepository.save(project1);

        project2.setName("Facebook");
        project2.setEdition(edition);
        project2.setCreator(user1);
        projectRepository.save(project2);

        organisation.setInfo("Think different");
        organisation.setName("Apple");
        //organisation.setProject(project1);

        organisationRepository.save(organisation);

        remove_security();
    }

    /**
     * Remove the test entities from the database.
     */
    @AfterEach
    public void removeSetUpRepository() {
        initialize_security();

        if (projectRepository.existsById(project1.getId())) {
            projectRepository.deleteById(project1.getId());
        }
        if (projectRepository.existsById(project2.getId())) {
            projectRepository.deleteById(project2.getId());
        }
        if (editionRepository.existsById(edition.getId())) {
            editionRepository.deleteById(edition.getId());
        }
        if (userRepository.existsById(user1.getId())) {
            userRepository.deleteById(user1.getId());
        }
        if (userRepository.existsById(user2.getId())) {
            userRepository.deleteById(user2.getId());
        }
        if (organisationRepository.existsById(organisation.getId())) {
            organisationRepository.deleteById(organisation.getId());
        }
        remove_security();
    }

    @Override
    public final Project create_entity() {
        Project postProject = new Project(TEST_STRING, edition, null, user1);
        return postProject;
    }

    @Override
    public final Project change_entity(final Project project) {
        project.setName(TEST_STRING);
        return project;
    }

    @Override
    public final ProjectRepository get_repository() {
        return projectRepository;
    }

    @Override
    public final Long get_id(final Project project) {
        return project.getId();
    }
}

