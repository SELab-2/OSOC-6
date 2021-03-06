package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.service.UserEntityService;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * This controller is used to handle the forgot and reset password process.
 * There is no authorization since this needs to be accessible without login.
 */
@RestController
@AllArgsConstructor
public class ForgotPasswordController {

    /**
     * This service is used to handle user-specific data.
     */
    private final UserEntityService userService;

    /**
     * Request a reset password for the user with the given email address.
     * @param email the email of the user requesting a password reset
     */
    @PostMapping("/" + DumbledorePathWizard.FORGOT_PASSWORD_PATH)
    public void requestPasswordReset(@RequestBody final String email) {
        userService.createPasswordResetToken(email);
    }

    /**
     * Reset the password of the user linked to the reset password token with the provided token.
     * @param token the token of the reset password token
     * @param newPassword the new password of the user
     */
    @PostMapping("/" + DumbledorePathWizard.RESET_PASSWORD_PATH)
    public void resetPassword(@RequestParam final String token, @RequestBody final String newPassword) {
        userService.resetUserPassword(token, newPassword);
    }
}
