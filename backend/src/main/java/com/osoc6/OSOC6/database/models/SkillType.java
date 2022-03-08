package com.osoc6.OSOC6.database.models;

public enum SkillType {
    /**
     * User/ student selected front-end developer.
     */
    FRONTEND_DEVELOPER {
        @Override
        public String getSkillName(final Skill skill) {
            return "front-end developer";
        }
    },

    /**
     * User/ student selected back-end developer.
     */
    BACKEND_DEVELOPER {
        @Override
        public String getSkillName(final Skill skill) {
            return "back-end developer";
        }
    },

    /**
     * User/ student selected UX/UI designer.
     */
    UX_UI_DESIGNER {
        @Override
        public String getSkillName(final Skill skill) {
            return "UX/UI designer";
        }
    },

    /**
     * User/ student selected graphic designer.
     */
    GRAPHIC_DESIGNER {
        @Override
        public String getSkillName(final Skill skill) {
            return "graphic designer";
        }
    },

    /**
     * User/ student selected business modeller.
     */
    BUSINESS_MODELLER {
        @Override
        public String getSkillName(final Skill skill) {
            return "business modeller";
        }
    },

    /**
     * User/ student selected storyteller.
     */
    STORYTELLER {
        @Override
        public String getSkillName(final Skill skill) {
            return "storyteller";
        }
    },

    /**
     * User/ student selected marketer.
     */
    MARKETER {
        @Override
        public String getSkillName(final Skill skill) {
            return "marketer";
        }
    },

    /**
     * User/ student selected copywriter.
     */
    COPYWRITER {
        @Override
        public String getSkillName(final Skill skill) {
            return "copywriter";
        }
    },

    /**
     * User/ student selected video editor.
     */
    VIDEO_EDITOR {
        @Override
        public String getSkillName(final Skill skill) {
            return "video editor";
        }
    },

    /**
     * User/ student selected photographer.
     */
    PHOTOGRAPHER {
        @Override
        public String getSkillName(final Skill skill) {
            return "photographer";
        }
    },

    /**
     * User/ student selected other and skill holds specified value.
     */
    OTHER {
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
}
