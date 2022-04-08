package com.osoc6.OSOC6.winterhold;

/**
 * Jitse will fill this.
 */
public final class MeguminExceptionWizard {

    /**
     * Constructor of class, does nothing. Makes sure this is a util class.
     */
    private MeguminExceptionWizard() { }

    /**
     * Exception string used for an {@link com.osoc6.OSOC6.exception.AccountTakenException}.
     */
    public static final String ACCOUNT_TAKEN_EXCEPTION = "The email-address %s is already assigned to an account.";

    /**
     * Exception string used for an {@link com.osoc6.OSOC6.exception.InvalidInvitationTokenException}.
     */
    public static final String INVALID_INVITATION_TOKEN_EXCEPTION =
            "The provided invitation token does not exist or is invalid.";

    /**
     * Exception string used as for a {@link org.springframework.data.rest.webmvc.ResourceNotFoundException}.
     */
    public static final String RESOURCE_NOT_FOUND_EXCEPTION = "Resource with provided identifiers was not found.";

    /**
     * Exception string used for a {@link org.springframework.security.core.userdetails.UsernameNotFoundException}.
     */
    public static final String USERNAME_NOT_FOUND_EXCEPTION = "User with email %s not found";
}
