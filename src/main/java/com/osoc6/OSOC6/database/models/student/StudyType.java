package com.osoc6.OSOC6.database.models.student;

public enum StudyType {
    PROFESSIONAL_BACHELOR {
        @Override
        public String getString(Study study) {
            return "professional bachelor";
        }
    },
    ACADEMIC_BACHELOR {
        @Override
        public String getString(Study study) {
            return "academic bachelor";
        }
    },
    ASSOCIATE {
        @Override
        public String getString(Study study) {
            return "associate";
        }
    },
    MASTER {
        @Override
        public String getString(Study study) {
            return "master";
        }
    },
    DOCTORAL {
        @Override
        public String getString(Study study) {
            return "doctoral";
        }
    },
    OTHER {
        @Override
        public String getString(Study study) {
            return study.getTitle();
        }
    },
    NONE {
        @Override
        public String getString(Study study) {
            return "";
        }
    };

    public abstract String getString(Study study);
}
