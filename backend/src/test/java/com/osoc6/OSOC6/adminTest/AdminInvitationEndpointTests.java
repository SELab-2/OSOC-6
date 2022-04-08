package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.dto.InvitationDTO;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import static org.mockito.Mockito.mockStatic;

/**
 * Class testing the integration of {@link Invitation} with admin privileges.
 */
public class AdminInvitationEndpointTests extends AdminEndpointTest<Invitation, Long, InvitationRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * Sample used invitation that gets loaded before every test.
     */
    private final Invitation usedInvitation = new Invitation(getBaseUserEdition(), getAdminUser(), getCoachUser());

    /**
     * Sample used invitation that gets loaded before every test.
     */
    private final Invitation unUsedInvitation = new Invitation(getBaseUserEdition(), getAdminUser(), null);

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * The actual path invitations are served on, with '/' as prefix.
     */
    private static final String INVITATION_PATH = "/" + DumbledorePathWizard.INVITATIONS_PATH;

    public AdminInvitationEndpointTests() {
        super(INVITATION_PATH, "");
    }

    @Override
    public final Long get_id(final Invitation entity) {
        return entity.getId();
    }

    @Override
    public final InvitationRepository get_repository() {
        return invitationRepository;
    }

    /**
     * Load test entities in the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        invitationRepository.save(usedInvitation);
        invitationRepository.save(unUsedInvitation);
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        invitationRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public final Invitation create_entity() {
        return new Invitation(getBaseUserEdition(), getAdminUser(), null);
    }

    /**
     * We don't implement this since an invitation is not really updatable.
     */
    @Override
    public final Map<String, String> change_entity(final Invitation startEntity) {
        throw new RuntimeException("An invitation is not really updatable. Do not call this method.");
    }

    /**
     * We need to override this test since an invitation is not really updatable.
     */
    @Override
    public void patch_changes_value() { }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void used_invitation_is_invalid() {
        assert !usedInvitation.isValid();
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void unused_invitation_before_expiration_is_valid() {
        assert unUsedInvitation.isValid();
    }

    /**
     * In this test we need to mock Instant.now() to be able to test
     * whether an expired invitation is no longer valid.
     */
    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void unused_invitation_after_expiration_is_invalid() {

        Instant inTheFuture = Instant.now().plus(8, ChronoUnit.DAYS);

        try (MockedStatic<Instant> mockedStatic = mockStatic(Instant.class)) {
            mockedStatic.when(Instant::now).thenReturn(inTheFuture);
            assert !unUsedInvitation.isValid();
        }
    }

    @Override
    public final String transform_to_json(final Invitation entity) {
        InvitationDTO helper = new InvitationDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }
}
