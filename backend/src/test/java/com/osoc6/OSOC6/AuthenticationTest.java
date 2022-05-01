package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.dto.RegistrationDTO;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.service.RegistrationService;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.FormLoginRequestBuilder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

import static org.mockito.Mockito.mockStatic;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.logout;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.authenticated;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the authentication in spring.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationTest extends TestFunctionProvider<Invitation, Long, InvitationRepository> {

    /**
     * The invitation repository which saves, searches, ... Invitations in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * The user repository which saves, searches, ... UserEntities in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Sample user that gets registered before every test.
     */
    private final RegistrationDTO loginTestUser =
            new RegistrationDTO("Login test user", "loginuser@test.com", "123456");

    /**
     * Sample invitation for loginTestUser that gets loaded before every test.
     */
    private final Invitation loginTestInvitation = TestEntityProvider.getBaseUnusedInvitation(this);

    /**
     * Sample unused invitation that gets loaded before every test.
     */
    private final Invitation unusedInvitation = TestEntityProvider.getBaseUnusedInvitation(this);

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
     * The service used to register users.
     */
    @Autowired
    private RegistrationService registrationService;

    /**
     * Load test entities in the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        invitationRepository.save(unusedInvitation);

        registrationService.register(loginTestUser, loginTestInvitation);
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();

        invitationRepository.deleteAll();
        userRepository.deleteAll();
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
        perform_get("/" + DumbledorePathWizard.LOGIN_PATH)
                .andExpect(status().isOk());
    }

    /**
     * For some reason the test does not keep its query params after the redirect.
     * That's why this test needs to post to /{LOGIN_PROCESSING_PATH} instead of /login
     * because posting to /login results in a redirect to /{LOGIN_PROCESSING_PATH}.
     * @throws Exception throws exception if the request or a check fails
     */
    @Test
    public void login_with_valid_user_works() throws Exception {
        FormLoginRequestBuilder login = formLogin()
                .user(loginTestUser.getEmail())
                .password(loginTestUser.getPassword())
                .loginProcessingUrl("/" + DumbledorePathWizard.LOGIN_PROCESSING_PATH);
        getMockMvc().perform(login)
                .andExpect(authenticated())
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/" + DumbledorePathWizard.AUTH_PATH
                        + "/" + DumbledorePathWizard.AUTH_HOME_PATH))
                .andDo(result -> perform_get(result.getResponse().getRedirectedUrl())
                        .andExpect(status().is3xxRedirection())
                        .andExpect(redirectedUrl("/home"))
                );
    }

    @Test
    public void login_with_invalid_user() throws Exception {
        FormLoginRequestBuilder login = formLogin()
                .user("invalid")
                .password("invalid")
                .loginProcessingUrl("/" + DumbledorePathWizard.LOGIN_PROCESSING_PATH);
        getMockMvc().perform(login)
                .andExpect(unauthenticated())
                .andExpect(status().isOk())
                // A forward is a server side handled redirect. The redirect code is tested in another test.
                .andExpect(forwardedUrl("/" + DumbledorePathWizard.AUTH_PATH
                        + "/" + DumbledorePathWizard.AUTH_FAIL_PATH));
    }

    @Test
    public void login_fail_handled_correctly() throws Exception {
        perform_post("/" + DumbledorePathWizard.AUTH_PATH + "/" + DumbledorePathWizard.AUTH_FAIL_PATH, null)
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/loginError"));
    }

    @Test
    public void register_with_valid_invitation_token_works() throws Exception {
        Map<String, String> registerMap = Map.of(
                "email", "register@test.com",
                "callName", "register man",
                "password", "123456"
        );
        getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                .queryParam("token", unusedInvitation.getToken())
                .content(Util.asJsonString(registerMap))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    public void register_with_valid_invitation_token_updates_invitation() throws Exception {
        String registerEmail = "register@test.com";
        Map<String, String> registerMap = Map.of(
                "email", registerEmail,
                "callName", "register man",
                "password", "123456"
        );
        getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                        .queryParam("token", unusedInvitation.getToken())
                        .content(Util.asJsonString(registerMap))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Invitation invitation = get_repository_entity_by_id(unusedInvitation.getId());
        assert invitation.getSubject().getEmail().equals(registerEmail);
    }

    @Test
    public void register_with_valid_invitation_token_with_existing_email_fails() throws Exception {
        Map<String, String> registerMap = Map.of(
                "email", getCoachUser().getEmail(),
                "callName", "register man",
                "password", "123456"
        );
        getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                        .queryParam("token", unusedInvitation.getToken())
                        .content(Util.asJsonString(registerMap))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(string_to_contains_string(
                        String.format(MeguminExceptionWizard.ACCOUNT_TAKEN_EXCEPTION, getCoachUser().getEmail())));
    }

    @Test
    public void register_with_nonexisting_invitation_token_fails() throws Exception {
        Map<String, String> registerMap = Map.of(
                "email", "register@test.com",
                "callName", "register man",
                "password", "123456"
        );
        getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                        .queryParam("token", "notavalidtoken")
                        .content(Util.asJsonString(registerMap))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(string_to_contains_string(MeguminExceptionWizard.INVALID_INVITATION_TOKEN_EXCEPTION));
    }

    @Test
    public void register_with_used_invitation_token_fails() throws Exception {
        Map<String, String> registerMap = Map.of(
                "email", "register@test.com",
                "callName", "register man",
                "password", "123456"
        );
        getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                        .queryParam("token", getInvitationActiveEditionForCoach().getToken())
                        .content(Util.asJsonString(registerMap))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(string_to_contains_string(MeguminExceptionWizard.INVALID_INVITATION_TOKEN_EXCEPTION));
    }

    /**
     * In this test we need to mock Instant.now() to be able to test
     * whether an expired invitation is no longer valid.
     */
    @Test
    public void register_with_expired_invitation_token_fails() throws Exception {
        Instant inTheFuture = Instant.now().plus(8, ChronoUnit.DAYS);

        try (MockedStatic<Instant> mockedStatic = mockStatic(Instant.class)) {
            mockedStatic.when(Instant::now).thenReturn(inTheFuture);

            Map<String, String> registerMap = Map.of(
                    "email", "register@test.com",
                    "callName", "register man",
                    "password", "123456"
            );
            getMockMvc().perform(post("/" + DumbledorePathWizard.REGISTRATION_PATH)
                            .queryParam("token", unusedInvitation.getToken())
                            .content(Util.asJsonString(registerMap))
                            .contentType(MediaType.APPLICATION_JSON)
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isForbidden())
                    .andExpect(string_to_contains_string(MeguminExceptionWizard.INVALID_INVITATION_TOKEN_EXCEPTION));
        }
    }

    @Test
    public void logout_valid_user_after_login() throws Exception {
        FormLoginRequestBuilder login = formLogin()
                .user(loginTestUser.getEmail())
                .password(loginTestUser.getPassword())
                .loginProcessingUrl("/" + DumbledorePathWizard.LOGIN_PROCESSING_PATH);
        getMockMvc().perform(login)
                .andExpect(authenticated());
        getMockMvc().perform(logout())
                .andExpect(unauthenticated());
    }

    @Test
    public void logout_non_authenticated_user() throws Exception {
        getMockMvc().perform(logout())
                .andExpect(status().isFound());
    }
}
