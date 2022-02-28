package com.osoc6.OSOC6.database.models.student;

public enum StudentRole {
    BACKEND {
        @Override
        public String getString(Role role) {
            return "backend";
        }
    },
    BUSINESS {
        @Override
        public String getString(Role role) {
            return "backend";
        }
    },
    COMMUNICATION {
        @Override
        public String getString(Role role) {
            return "communication";
        }
    },
    DESIGN {
        @Override
        public String getString(Role role) {
            return "design";
        }
    },
    FRONTEND {
        @Override
        public String getString(Role role) {
            return "frontend";
        }
    },
    MARKETING {
        @Override
        public String getString(Role role) {
            return "marketing";
        }
    },
    PHOTOGRAPHY {
        @Override
        public String getString(Role role) {
            return "photography";
        }
    },
    VIDEOGRAPHY {
        @Override
        public String getString(Role role) {
            return "videography";
        }
    },
    OTHER {
        @Override
        public String getString(Role role) {
            return role.getTitle();
        }
    };

    public abstract String getString(Role role);
}
