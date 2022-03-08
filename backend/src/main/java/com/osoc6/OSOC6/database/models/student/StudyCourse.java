package com.osoc6.OSOC6.database.models.student;

public enum StudyCourse {
    /**
     * Student studies backend development.
     */
    BACKEND_DEVELOPMENT {
        @Override
        public String getCourse(final Study study) {
            return "backend development";
        }
    },

    /**
     * Student studies business management.
     */
    BUSINESS_MANAGEMENT {
        @Override
        public String getCourse(final Study study) {
            return "business management";
        }
    },

    /**
     * Student studies communication sciences.
     */
    COMMUNICATION_SCIENCES {
        @Override
        public String getCourse(final Study study) {
            return "communication sciences";
        }
    },

    /**
     * Student studies design.
     */
    DESIGN {
        @Override
        public String getCourse(final Study study) {
            return "design";
        }
    },

    /**
     * Student studies frontend development.
     */
    FRONTEND_DEVELOPMENT {
        @Override
        public String getCourse(final Study study) {
            return "frontend development";
        }
    },

    /**
     * Student studies marketing.
     */
    MARKETING {
        @Override
        public String getCourse(final Study study) {
            return "marketing";
        }
    },

    /**
     * Student studies photography.
     */
    PHOTOGRAPHY {
        @Override
        public String getCourse(final Study study) {
            return "photography";
        }
    },

    /**
     * Student studies videography.
     */
    VIDEOGRAPHY {
        @Override
        public String getCourse(final Study study) {
            return "videography";
        }
    },

    /**
     * Student studies something else, the name is specified in the Study entity.
     */
    OTHER {
        @Override
        public String getCourse(final Study study) {
            return study.getTitle();
        }
    };

    /**
     *
     * @param study entity related to the student
     * @return title of course taken by student
     */
    public abstract String getCourse(Study study);
}
