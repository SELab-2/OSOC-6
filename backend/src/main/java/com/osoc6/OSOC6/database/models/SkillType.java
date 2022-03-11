package com.osoc6.OSOC6.database.models;

public enum SkillType {
    /**
     * User/ student selected front-end developer.
     */
    FRONTEND_DEVELOPER {
        @Override
        public String toString() {
            return "front-end developer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected back-end developer.
     */
    BACKEND_DEVELOPER {
        @Override
        public String toString() {
            return "back-end developer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected UX/UI designer.
     */
    UX_UI_DESIGNER {
        @Override
        public String toString() {
            return "UX/UI designer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected graphic designer.
     */
    GRAPHIC_DESIGNER {
        @Override
        public String toString() {
            return "graphic designer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected business modeller.
     */
    BUSINESS_MODELLER {
        @Override
        public String toString() {
            return "business modeller";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected storyteller.
     */
    STORYTELLER {
        @Override
        public String toString() {
            return "storyteller";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected marketer.
     */
    MARKETER {
        @Override
        public String toString() {
            return "marketer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected copywriter.
     */
    COPYWRITER {
        @Override
        public String toString() {
            return "copywriter";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected video editor.
     */
    VIDEO_EDITOR {
        @Override
        public String toString() {
            return "video editor";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected photographer.
     */
    PHOTOGRAPHER {
        @Override
        public String toString() {
            return "photographer";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return toString();
        }
    },

    /**
     * User/ student selected other and skill holds specified value.
     */
    OTHER {
        @Override
        public String toString() {
            return "other";
        }

        @Override
        public String getSkillName(final Skill skill) {
            return skill.getName();
        }
    };

    /**
     * @param skill this type was the type of
     * @return name of the provided skill
     */
    public abstract String getSkillName(Skill skill);

    /**
     *
     * @return string representation of the enum
     */
    public abstract String toString();

    /**
     *
     * @param skill as string that you want ro return as enum representation
     * @return enum type of the provided string
     */
    public static SkillType fromString(final String skill) {
        SkillType[] skillTypes = SkillType.values();
        SkillType result = SkillType.OTHER;
        int i = 0;
        while (result == SkillType.OTHER && i < skillTypes.length) {
            if (skillTypes[i].toString().equalsIgnoreCase(skill)) {
                result = skillTypes[i];
            }
            i++;
        }
        return result;
    }
}
