package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Invitation} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachInvitationEndpointTests extends TestFunctionProvider<Invitation, Long, InvitationRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * Sample invitation that gets loaded before every test.
     */
    private final Invitation invitation = new Invitation(getBaseUserEdition(), getAdminUser(), getCoachUser());

    /**
     * The actual path invitations are served on, with '/' as prefix.
     */
    private static final String INVITATION_PATH = "/" + DumbledorePathWizard.INVITATIONS_PATH;

    public CoachInvitationEndpointTests() {
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

        invitationRepository.save(invitation);
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
        return null;
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_all_returns_fails() throws Exception {
        perform_get(getEntityPath())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void get_invitation_by_id_fails() throws Exception {
        perform_get(getEntityPath() + "/" + invitation.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_fails() throws Exception {
        Invitation entity = create_entity();

        perform_post(getEntityPath(), entity)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_invitation_fails() throws Exception {
        Invitation entity = get_random_repository_entity();
        perform_delete_with_id(getEntityPath(), entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        Invitation entity = get_random_repository_entity();

        perform_patch(getEntityPath() + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails() throws Exception {
        perform_get(getEntityPath() + "/" + getILLEGAL_ID())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_id_fails() throws Exception {
        Invitation entity = create_entity();

        perform_entity_patch(getEntityPath() + "/" + getILLEGAL_ID(), entity)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}
