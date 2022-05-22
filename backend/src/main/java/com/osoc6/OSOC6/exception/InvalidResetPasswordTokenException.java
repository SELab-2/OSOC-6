package com.osoc6.OSOC6.exception;

import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;

/**
 * This custom exception is thrown when an invalid reset password token is used when attempting to reset a password.
 */
public class InvalidResetPasswordTokenException extends RuntimeException {
    /**
     * This custom exception is thrown when an invalid reset password token is used
     * when attempting to reset a password.
     */
    public InvalidResetPasswordTokenException() {
        super(MeguminExceptionWizard.INVALID_RESET_PASSWORD_TOKEN_EXCEPTION);
    }
}
