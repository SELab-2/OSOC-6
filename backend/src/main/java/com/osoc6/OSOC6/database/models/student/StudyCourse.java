package com.osoc6.OSOC6.database.models.student;

public enum StudyCourse {
    /**
     * Student studies backend development.
     */
    BACKEND_DEVELOPMENT {
        @Override
        public String toString() {
            return "backend development";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies business management.
     */
    BUSINESS_MANAGEMENT {
        @Override
        public String toString() {
            return "business management";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies communication sciences.
     */
    COMMUNICATION_SCIENCES {
        @Override
        public String toString() {
            return "communication sciences";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies design.
     */
    DESIGN {
        @Override
        public String toString() {
            return "design";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies frontend development.
     */
    FRONTEND_DEVELOPMENT {
        @Override
        public String toString() {
            return "frontend development";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies marketing.
     */
    MARKETING {
        @Override
        public String toString() {
            return "marketing";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies photography.
     */
    PHOTOGRAPHY {
        @Override
        public String toString() {
            return "photography";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies videography.
     */
    VIDEOGRAPHY {
        @Override
        public String toString() {
            return "videography";
        }

        @Override
        public String getCourse(final Study study) {
            return toString();
        }
    },

    /**
     * Student studies something else, the name is specified in the Study entity.
     */
    OTHER {
        @Override
        public String toString() {
            return "other";
        }

        @Override
        public String getCourse(final Study study) {
            return study.getCourseName();
        }
    };

    /**
     *
     * @param study entity related to the student
     * @return title of course taken by student
     */
    public abstract String getCourse(Study study);

    /**
     *
     * @return string representation of the enum.
     */
    public abstract String toString();

    /**
     *
     * @param course course as string that should be represented as enum
     * @return enum type of the provided string.
     */
    public static StudyCourse fromString(final String course) {
        StudyCourse[] courses = StudyCourse.values();
        StudyCourse result = StudyCourse.OTHER;
        int i = 0;
        while (result == StudyCourse.OTHER && i < courses.length) {
            if (courses[i].toString().equalsIgnoreCase(course)) {
                result = courses[i];
            }
            i++;
        }
        return result;
    }
}
