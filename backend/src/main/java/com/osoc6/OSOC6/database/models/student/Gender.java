package com.osoc6.OSOC6.database.models.student;

import com.osoc6.OSOC6.exception.WebhookException;

/**
 * An enum listing the different kinds of genders a {@link Student} can have.
 */
public enum Gender {
    /**
     * identified gender as female.
     */
    FEMALE("Female") {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.SHE;
        }
    },

    /**
     * identified gender as male.
     */
    MALE("Male") {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.HE;
        }
    },

    /**
     * identified gender as transgender.
     */
    TRANSGENDER("Transgender") {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.THEY;
        }
    },

    /**
     * Gender was not specified. If no pronouns are specified either, we will default to pronouns THEY/THEM/THEIRS.
     */
     NOT_SPECIFIED("Rather not say") {
         @Override
         public PronounsType getDefaultPronouns() {
             return PronounsType.THEY;
         }
     };

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
            if (gender.genderString.equals(text)) {
                return gender;
            }
        }
        throw new WebhookException(String.format("No gender matching %s found.", text));
    }

    /**
     * IMPORTANT: should NEVER return PronounsType.None. An infinite loop will be triggered.
     * @return default pronouns for a gender if pronouns are not specified.
     */
    public abstract PronounsType getDefaultPronouns();
}
