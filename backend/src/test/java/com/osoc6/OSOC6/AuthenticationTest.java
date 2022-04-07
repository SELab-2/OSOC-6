package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.FormLoginRequestBuilder;

import java.util.Map;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the authentication in spring.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationTest extends TestFunctionProvider<Invitation, Long, InvitationRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * Sample invitation that gets loaded before every test.
     */
    private final Invitation invitation = new Invitation(getBaseUserEdition(), getAdminUser(), null);

    /**
     * The actual path invitations are served on, with '/' as prefix.
     */
    private static final String INVITATION_PATH = "/" + DumbledorePathWizard.INVITATIONS_PATH;

    public AuthenticationTest() {
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
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();
    }

    @Override
    public final Invitation create_entity() {
        return null;
    }

    @Override
    public final Map<String, String> change_entity(final Invitation startEntity) {
        return null;
    }

    @Test
    public void login_available_for_all() throws Exception {
        perform_get("/login")
                .andExpect(status().isOk());
    }

    @Test
    public void login_with_valid_user_works() throws Exception {
        Map<String, String> loginMap = Map.of(
                "email", getCoachUser().getEmail(),
                "password", getCoachUser().getPassword());
        getMockMvc().perform(post("/login")
                    .content(loginMap.toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON));
    }

    @Test
    public void login_with_invalid_user() throws Exception {
        FormLoginRequestBuilder login = formLogin().user("invalid").password("invalid");
        getMockMvc().perform(login).andExpect(unauthenticated());
    }

    @Test
    public void register_with_valid_invitation_token_works() {

    }

    @Test
    public void register_with_nonexisting_invitation_token_fails() {

    }

    @Test
    public void register_with_used_invitation_token_fails() {

    }

    @Test
    public void register_with_expired_invitation_token_fails() {

    }
}
