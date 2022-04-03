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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Invitation}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminInvitationEndpointTests extends AdminEndpointTest<Invitation, Long, InvitationRepository> {

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
    public final Long get_id(final Invitation entity) {
        return entity.getId();
    }

    @Override
    public final InvitationRepository get_repository() {
        return repository;
    }

    /**
     * Add two test invitations to the database.
     */
    @Override
    public void setUpRepository() {
        // Save edition
        editionRepository.save(edition);

        // Since the userRepository is secured,
        // we need to create a temporary authentication token to be able to save the test users
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        // Needed for database relation
        userRepository.save(issuer);
        userRepository.save(subject);
        userRepository.save(testSubject);

        // Save invitations
        repository.save(invitation1);
        repository.save(invitation2);

        // After saving the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    /**
     * Remove the two test invitations from the database.
     */
    @Override
    public void removeSetUpRepository() {
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
        if (userRepository.existsById(testSubject.getId())) {
            userRepository.deleteById(testSubject.getId());
        }

        // After deleting the test users, we clear the security context as to not interfere with any remaining tests.
        SecurityContextHolder.clearContext();
    }

    @Override
    public final Invitation create_entity() {
        return new Invitation(edition, issuer, testSubject);
    }

    @Override
    public final Map<String, String> change_entity(final Invitation startEntity) {
        Map<String, String> patchMap = new HashMap<>();
        String entityToUrl = entityLinks.linkToItemResource(Invitation.class, testSubject.getId().toString()).getHref();
        patchMap.put("subject", entityToUrl);
        return patchMap;
    }

    @Test
    @Override
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public final void add_new() throws Exception {
        Invitation entity = create_entity();

        save_repository_entity(entity);

        check_get(getEntityPath(), entity.getTimestamp().toString());

        delete_repository_entity(entity);
    }

    @Test
    @Override
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public final void post_new() throws Exception {
        Invitation entity = create_entity();

        perform_post(INVITATION_PATH, entity);
        check_get(INVITATION_PATH, entity.getTimestamp().toString());
        get_repository().delete(entity);
    }

    @Test
    @Override
    public final void delete_entity_throws_not_found() throws Exception {
        Invitation newEntity = create_entity();
        perform_post(INVITATION_PATH, newEntity);

        List<Invitation> entities = get_repository().findAll();
        Invitation entity = entities.get(0);

        // Is the invitation really in /invitations
        check_get(INVITATION_PATH, newEntity.getTimestamp().toString());

        // Run the delete request
        perform_delete_with_id(INVITATION_PATH, get_id(entity));

        perform_delete_with_id(INVITATION_PATH, get_id(entity))
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    @Test
    @Override
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public final void delete_new() throws Exception {
        Invitation newEntity = create_entity();
        perform_post(INVITATION_PATH, newEntity);

        List<Invitation> entities = get_repository().findAll();
        Invitation entity = entities.get(0);

        // Is the entity really in /entity
        check_get(INVITATION_PATH, newEntity.getTimestamp().toString());

        // Run the delete request
        perform_delete_with_id(INVITATION_PATH, get_id(entity));

        // Check if still there
        if (get_repository().existsById(get_id(entity))) {
            throw new Exception();
        }
    }

    /**
     * Transactional is needed because a user gets fetched lazily.
     */
    @Test
    @Override
    @Transactional
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patch_changes_value() throws Exception {
        super.patch_changes_value();
    }
}
