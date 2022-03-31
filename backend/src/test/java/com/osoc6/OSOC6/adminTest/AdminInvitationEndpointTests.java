package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;

/**
 * Class testing the integration of {@link Invitation}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminInvitationEndpointTests extends AdminEndpointTest<Invitation, Long, InvitationRepository>{

    /**
     * The actual path invitations are served on, with '/' as prefix.
     */
    private static final String INVITATION_PATH = "/" + DumbledorePathWizard.INVITATION_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "TEST SUBJECT";

    /**
     * issuer.
     */
    private final UserEntity issuer = new UserEntity("test@mail.com", "joe", UserRole.ADMIN, "test");

    /**
     * subject user.
     */
    private final UserEntity subject = new UserEntity("test2@mail.com", "joe2", UserRole.ADMIN, "test");

    /**
     * Edition needed for invitations.
     */
    private final Edition edition = new Edition("Test Edition", 2022, true);

    /**
     * test user subject.
     */
    private final UserEntity testSubject = new UserEntity("test3@mail.com", TEST_STRING, UserRole.ADMIN, "test");

    /**
     * First sample invitation.
     */
    private final Invitation invitation1 = new Invitation(edition, issuer, subject);

    /**
     * Second sample invitation.
     */
    private final Invitation invitation2 = new Invitation(edition, issuer, subject);

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository repository;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

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

    public AdminInvitationEndpointTests() {
        super(INVITATION_PATH, TEST_STRING);
    }

    @Override
    public final Long get_id(Invitation entity) {
        return entity.getId();
    }

    @Override
    public final InvitationRepository get_repository() {
        return repository;
    }

    @Override
    public void setUpRepository() {
        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to save the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        // Needed for database relation
        userRepository.save(issuer);
        userRepository.save(subject);

        // After saving the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();

        // Save edition
        editionRepository.save(edition);

        // Save invitations
        repository.save(invitation1);
        repository.save(invitation2);
    }

    /**
     * Remove the two test invitations from the database.
     */
    @AfterEach
    public void removeTestSuggestions() {
        // All invitations need to be deleted,
        // Otherwise there will be a relation with the user
        repository.deleteAll();

        editionRepository.deleteById(edition.getId());

        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to save the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        if (userRepository.existsById(issuer.getId())) {
            userRepository.deleteById(issuer.getId());
        }
        if (userRepository.existsById(subject.getId())) {
            userRepository.deleteById(subject.getId());
        }

        // After deleting the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    @Override
    public Invitation create_entity() {
        return new Invitation(edition, issuer, testSubject);
    }

    @Override
    public Invitation change_entity(Invitation startEntity) {
        startEntity.setSubject(testSubject);
        return startEntity;
    }
}
