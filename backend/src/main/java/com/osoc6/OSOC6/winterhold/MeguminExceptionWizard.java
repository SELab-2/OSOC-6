package com.osoc6.OSOC6.winterhold;

/**
 * {@link MeguminExceptionWizard} is a wizard that helps us remember Exception messages.
 * Megumin is a wizard that focuses solely on Explosion magic, an exception in code is kind of like an Explosion.
 * Megumin loves them so much she had the desire to help us handle exceptions.
 * Whenever we need an exception message we will ask Megumin.
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
