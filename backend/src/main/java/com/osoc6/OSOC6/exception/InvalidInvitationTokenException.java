package com.osoc6.OSOC6.exception;

import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;

/**
 * This custom exception is thrown when an invalid invitation token is used when attempting to register a new user.
 */
public class InvalidInvitationTokenException extends RuntimeException {
    /**
     * This custom exception is thrown when an invalid invitation token is used
     * when attempting to register a new user.
     */
    public InvalidInvitationTokenException() {
        super(MeguminExceptionWizard.INVALID_INVITATION_TOKEN_EXCEPTION);
    }
}
