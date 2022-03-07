package com.osoc6.OSOC6.database.models.student;

public enum StudyType {
    /**
     * The professional bachelor study.
     */
    PROFESSIONAL_BACHELOR {
        @Override
        public String getString(final Study study) {
            return "professional bachelor";
        }
    },
    /**
     * The academic bachelor study.
     */
    ACADEMIC_BACHELOR {
        @Override
        public String getString(final Study study) {
            return "academic bachelor";
        }
    },
    /**
     * The associate's degree study.
     */
    ASSOCIATE {
        @Override
        public String getString(final Study study) {
            return "associate";
        }
    },
    /**
     * The master's degree study.
     */
    MASTER {
        @Override
        public String getString(final Study study) {
            return "master";
        }
    },
    /**
     * The doctoral degree study.
     */
    DOCTORAL {
        @Override
        public String getString(final Study study) {
            return "doctoral";
        }
    },
    /**
     * Any other study.
     */
    OTHER {
        @Override
        public String getString(final Study study) {
            return study.getTitle();
        }
    },
    /**
     * No study.
     */
    NONE {
        @Override
        public String getString(final Study study) {
            return "";
        }
    };

    /**
     *
     * @param study the study of which the title can be taken
     * @return the study as a String
     */
    public abstract String getString(Study study);
}
