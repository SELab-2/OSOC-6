package com.osoc6.OSOC6.exception;

/**
 * This custom exception is thrown when an invalid invitation token is used when attempting to register a new user.
 */
public class InvalidInvitationTokenException extends RuntimeException {
    /**
     * This custom exception is thrown when an invalid invitation token is used
     * when attempting to register a new user.
     */
    public InvalidInvitationTokenException() {
        super("The provided invitation token does not exist or is invalid.");
    }
}
