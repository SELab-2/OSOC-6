package com.osoc6.OSOC6.winterhold;

/**
 * The {@link RadagastNumberWizard} is a wizard that helps us in the noble quest to not use Magic numbers ourselves.
 * Whenever a magic number is needed we will ask Radagast to cast a spell creating the magic number.
 * Radagast will remind us of what we should use the numbers for.
 */
public final class RadagastNumberWizard {
    /**
     * Constructor of class, does nothing. Makes sure this is a util class.
     */
    private RadagastNumberWizard() { }

    /**
     * Length that should be reserved in database for an email.
     */
    public static final int EMAIL_LENGTH = 100;

    /**
     * Length that should be reserved in database for a first name.
     */
    public static final int FIRST_NAME_LENGTH = 50;

    /**
     * Length that should be reserved in database for a last name.
     */
    public static final int LAST_NAME_LENGTH = 50;

    /**
     * Length that should be reserved in database for a call name.
     */
    public static final int CALL_NAME_LENGTH = 100;

    /**
     * Length that should be reserved in database for a phone number.
     */
    public static final int PHONE_NUMBER_LENGTH = 20;

    /**
     * Length that should be reserved in database for a description.
     */
    public static final int DEFAULT_DESCRIPTION_LENGTH = 100;

    /**
     * Length the should be reserved in database for a small description.
     */
    public static final int SMALL_DESCRIPTION_LENGTH = 20;

    /**
     * Length that should be reserved in database for the description of a colour.
     */
    public static final int COLOUR_DESCRIPTION_LENGTH = 10;

    /**
     * Amount of days before an invitation is invalid.
     */
    public static final int INVITATION_EXPIRATION_DAYS = 7;

    /**
     * Amount of milliseconds in a second.
     */
    public static final int MILLISECOND_IN_SECOND = 1000;

    /**
     * Amount of hours before a reset password token is invalid.
     */
    public static final int PASSWORD_TOKEN_EXPIRATION_HOURS = 1;
}
