package com.osoc6.OSOC6.anonymousTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.ResetPasswordToken;
import com.osoc6.OSOC6.repository.PublicRepository;
import com.osoc6.OSOC6.repository.ResetPasswordTokenRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the forgot and reset password process.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class ForgotPasswordTest extends TestFunctionProvider<ResetPasswordToken, Long, ResetPasswordTokenRepository> {
    /**
     * The public repository, used to access the database without authorization.
     */
    @Autowired
    private PublicRepository publicRepository;

    /**
     * The reset password token repository which saves, searches, ... {@link ResetPasswordToken} in the database
     */
    @Autowired
    private ResetPasswordTokenRepository resetPasswordTokenRepository;

    /**
     * Sample reset password token that gets loaded before every test.
     */
    private ResetPasswordToken resetPasswordToken;

    /**
     * The reset password token is not really served on a path, so it does not make sense to set one.
     */
    public ForgotPasswordTest() {
        super(null, null);
    }

    @Override
    public final ResetPasswordToken create_entity() {
        return null;
    }

    @Override
    public final Map<String, String> change_entity(final ResetPasswordToken startEntity) {
        return null;
    }

    @Override
    public final Long get_id(final ResetPasswordToken entity) {
        return entity.getId();
    }

    @Override
    public final ResetPasswordTokenRepository get_repository() {
        return resetPasswordTokenRepository;
    }

    /**
     * Load test entities in the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        resetPasswordToken = new ResetPasswordToken(getAdminUser());
        resetPasswordTokenRepository.save(resetPasswordToken);
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        resetPasswordTokenRepository.deleteAll();

        removeBasicData();
    }

    @Test
    public void existing_user_request_password_reset_creates_password_reset_token() throws Exception {
        String email = getCoachUser().getEmail();

        getMockMvc().perform(post("/" + DumbledorePathWizard.FORGOT_PASSWORD_PATH)
                .content(email)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Optional<ResetPasswordToken> optionalResetPasswordToken =
                resetPasswordTokenRepository.findFirstBySubjectEmail(email);

        assertTrue(optionalResetPasswordToken.isPresent());
        assertTrue(optionalResetPasswordToken.get().isValid());
    }

    @Test
    public void non_existing_user_request_password_reset_does_not_create_password_reset_token() throws Exception {
        String email = "idontexist@nope.com";

        getMockMvc().perform(post("/" + DumbledorePathWizard.FORGOT_PASSWORD_PATH)
                        .content(email)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Optional<ResetPasswordToken> optionalResetPasswordToken =
                resetPasswordTokenRepository.findFirstBySubjectEmail(email);

        assertTrue(optionalResetPasswordToken.isEmpty());
    }

    @Test
    public void reset_password_with_existing_and_valid_token_works() throws Exception {
        String oldPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

        String newPw = "mynewpw12";

        getMockMvc().perform(post("/" + DumbledorePathWizard.RESET_PASSWORD_PATH)
                        .queryParam("token", resetPasswordToken.getToken())
                        .content(newPw)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl(DumbledorePathWizard.LOGIN_PATH));

        String newEncodedPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

        assertNotEquals(oldPw, newEncodedPw);
        assertNotEquals(newPw, newEncodedPw);

        Optional<ResetPasswordToken> optionalResetPasswordToken =
                resetPasswordTokenRepository.findById(resetPasswordToken.getId());

        assertTrue(optionalResetPasswordToken.isEmpty());
    }

    @Test
    public void reset_password_with_existing_but_expired_token_fails() throws Exception {
        String oldPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

        Instant inTheFuture = Instant.now().plus(2, ChronoUnit.HOURS);

        try (MockedStatic<Instant> mockedStatic = mockStatic(Instant.class)) {
            mockedStatic.when(Instant::now).thenReturn(inTheFuture);

            getMockMvc().perform(post("/" + DumbledorePathWizard.RESET_PASSWORD_PATH)
                            .queryParam("token", resetPasswordToken.getToken())
                            .content("wontchangeanyway")
                            .contentType(MediaType.APPLICATION_JSON)
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().isForbidden())
                    .andExpect(string_to_contains_string(
                            MeguminExceptionWizard.INVALID_RESET_PASSWORD_TOKEN_EXCEPTION));

            String unchangedPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

            assertEquals(oldPw, unchangedPw);
        }
    }

    @Test
    public void reset_password_with_non_existing_token_fails() throws Exception {
        String oldPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

        getMockMvc().perform(post("/" + DumbledorePathWizard.RESET_PASSWORD_PATH)
                        .queryParam("token", "123-45")
                        .content("wontchangeanyway")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(string_to_contains_string(MeguminExceptionWizard.INVALID_RESET_PASSWORD_TOKEN_EXCEPTION));

        String unchangedPw = publicRepository.internalFindByEmail(getAdminUser().getEmail()).get().getPassword();

        assertEquals(oldPw, unchangedPw);
    }
}
