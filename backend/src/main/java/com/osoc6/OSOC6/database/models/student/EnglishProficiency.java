package com.osoc6.OSOC6.database.models.student;

/**
 * An enum listing the different kinds of English proficiency a {@link Student} can have.
 */
public enum EnglishProficiency {
    /**
     * Can understand your form, but it is hard for me to reply.
     */
    READ_NOT_WRITE,

    /**
     * Can have simple conversations.
     */
    SIMPLE_CONVERSATION,

    /**
     * Can express themselves, understand people and get a point across.
     */
    EXPRESSIVE,

    /**
     * Can have extensive and complicated conversations.
     */
    EXTENSIVE,

    /**
     * Fluent in English.
     */
    FLUENT;
}
