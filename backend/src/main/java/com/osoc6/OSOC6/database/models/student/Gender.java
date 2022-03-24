package com.osoc6.OSOC6.database.models.student;

/**
 * An enum listing the different kinds of genders a {@link Student} can have.
 */
public enum Gender {
    /**
     * identified gender as female.
     */
    FEMALE {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.SHE;
        }
    },

    /**
     * identified gender as male.
     */
    MALE {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.HE;
        }
    },

    /**
     * identified gender as transgender.
     */
    TRANSGENDER {
        @Override
        public PronounsType getDefaultPronouns() {
            return PronounsType.THEY;
        }
    },

    /**
     * Gender was not specified. If no pronouns are specified either, we will default to pronouns THEY/THEM/THEIRS.
     */
     NOT_SPECIFIED {
         @Override
         public PronounsType getDefaultPronouns() {
             return PronounsType.THEY;
         }
     };

    /**
     * IMPORTANT: should NEVER return PronounsType.None. An infinite loop will be triggered.
     * @return default pronouns for a gender if pronouns are not specified.
     */
    public abstract PronounsType getDefaultPronouns();
}
