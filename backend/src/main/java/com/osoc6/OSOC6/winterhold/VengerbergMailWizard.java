package com.osoc6.OSOC6.winterhold;

/**
 * The {@link VengerbergMailWizard} that helps us with all email related Strings.
 * Yennefer of Vengerberg uses a Megascope for long range communication.
 * She can use this to send emails all over the world.
 */
public final class VengerbergMailWizard {

    /**
     * Constructor of class, does nothing. Makes sure this is a util class.
     */
    private VengerbergMailWizard() { }

    /**
     * The from email address, this is not actually seen in the mail, but needs to be set anyway.
     */
    public static final String FROM_MAIL_ADDRESS = "noreply@osoc.com";

    /**
     * The subject of the reset password mail.
     */
    public static final String RESET_PASSWORD_SUBJECT = "Reset password - OSOC selection tool";

    /**
     * The content of the password reset mail.
     */
    public static final String RESET_PASSWORD_TEXT = """
            Use the link below to reset your password.
            Please note that the link is only valid for %s hours after the request.
            %s
            """;
}
