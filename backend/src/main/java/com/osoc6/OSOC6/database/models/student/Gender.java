package com.osoc6.OSOC6.database.models.student;

import com.osoc6.OSOC6.exception.WebhookException;

/**
 * An enum listing the different kinds of genders a {@link Student} can have.
 */
public enum Gender {
    /**
     * identified gender as female.
     */
    FEMALE("Female"),

    /**
     * identified gender as male.
     */
    MALE("Male"),

    /**
     * identified gender as transgender.
     */
    TRANSGENDER("Transgender"),

    /**
     * Gender was not specified. If no pronouns are specified either, we will default to pronouns THEY/THEM/THEIRS.
     */
     NOT_SPECIFIED("Rather not say");

    /**
     * The gender as a string. Used to parse the data from the tally webhook.
     */
    private final String genderString;

    Gender(final String newGenderString) {
        genderString = newGenderString;
    }

    /**
     * Parse a string into a Gender enum object.
     * @param text the string to parse
     * @return the corresponding Gender enum
     * @throws WebhookException if no matching gender was found
     */
    public static Gender fromText(final String text) {
        for (Gender gender : Gender.values()) {
            if (gender.genderString.equalsIgnoreCase(text)) {
                return gender;
            }
        }
        throw new WebhookException(String.format("No gender matching %s found.", text));
    }
}
