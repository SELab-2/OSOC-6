package com.osoc6.OSOC6.database.models.student;

public enum StudentRole {
    /**
     * The role of backend developer.
     */
    BACKEND {
        @Override
        public String getString(final Role role) {
            return "backend";
        }
    },
    /**
     * The business role.
     */
    BUSINESS {
        @Override
        public String getString(final Role role) {
            return "backend";
        }
    },
    /**
     * The communication role.
     */
    COMMUNICATION {
        @Override
        public String getString(final Role role) {
            return "communication";
        }
    },
    /**
     * The role of designer.
     */
    DESIGN {
        @Override
        public String getString(final Role role) {
            return "design";
        }
    },
    /**
     * The role of frontend developer.
     */
    FRONTEND {
        @Override
        public String getString(final Role role) {
            return "frontend";
        }
    },
    /**
     * The marketing role.
     */
    MARKETING {
        @Override
        public String getString(final Role role) {
            return "marketing";
        }
    },
    /**
     * The photography role.
     */
    PHOTOGRAPHY {
        @Override
        public String getString(final Role role) {
            return "photography";
        }
    },
    /**
     * The videography role.
     */
    VIDEOGRAPHY {
        @Override
        public String getString(final Role role) {
            return "videography";
        }
    },
    /**
     * Any other role.
     */
    OTHER {
        @Override
        public String getString(final Role role) {
            return role.getTitle();
        }
    };

    /**
     *
     * @param role the role of which the title can be gotten
     * @return the role as a String
     */
    public abstract String getString(Role role);
}
