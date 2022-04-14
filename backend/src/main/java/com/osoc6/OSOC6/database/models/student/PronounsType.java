package com.osoc6.OSOC6.database.models.student;

/**
 * An enum listing the different kinds of pronouns a user can choose.
 * This lists the most common pronouns.
 */
public enum PronounsType {
    /**
     * For people who prefer "SHE"-pronouns.
     */
    SHE {
        @Override
        public String getPossessive(final Student student) {
            return "hers";
        }

        @Override
        public String getSubjective(final Student student) {
            return "she";
        }

        @Override
        public String getObjective(final Student student) {
            return "her";
        }
    },
    /**
     * For people who prefer "HE"-pronouns.
     */
    HE {
        @Override
        public String getPossessive(final Student student) {
            return "his";
        }

        @Override
        public String getSubjective(final Student student) {
            return "he";
        }

        @Override
        public String getObjective(final Student student) {
            return "him";
        }
    },
    /**
     * For people who prefer "THEY"-pronouns.
     */
    THEY {
        @Override
        public String getPossessive(final Student student) {
            return "theirs";
        }

        @Override
        public String getSubjective(final Student student) {
            return "they";
        }

        @Override
        public String getObjective(final Student student) {
            return "them";
        }
    },
    /**
     * For people who prefer "ZE"-pronouns.
     */
    ZE {
        @Override
        public String getPossessive(final Student student) {
            return "hir";
        }

        @Override
        public String getSubjective(final Student student) {
            return "ze";
        }

        @Override
        public String getObjective(final Student student) {
            return "hir";
        }
    },
    /**
     * For people who prefer their first name.
     */
    FIRSTNAME {
        @Override
        public String getPossessive(final Student student) {
            return student.getFirstName();
        }

        @Override
        public String getSubjective(final Student student) {
            String first = student.getFirstName();
            if (first.charAt(first.length() - 1) == 's') {
                return first + "'";
            }
            return first + "'s";
        }

        @Override
        public String getObjective(final Student student) {
            return student.getFirstName();
        }
    },
    /**
     * For people who prefer their callname.
     */
    CALLNAME {
        @Override
        public String getPossessive(final Student student) {
            return student.getCallName();
        }

        @Override
        public String getSubjective(final Student student) {
            String call = student.getCallName();
            if (call.charAt(call.length() - 1) == 's') {
                return call + "'";
            }
            return call + "'s";
        }

        @Override
        public String getObjective(final Student student) {
            return student.getCallName();
        }
    },
    /**
     * For people who prefer other pronouns.
     */
    OTHER {
        @Override
        public String getPossessive(final Student student) {
            return student.defaultGetPossessive();
        }

        @Override
        public String getSubjective(final Student student) {
            return student.defaultGetSubjective();
        }

        @Override
        public String getObjective(final Student student) {
            return student.defaultGetObjective();
        }
    },
    /**
     * For people who prefer no pronouns.
     */
    NONE {
        @Override
        public String getPossessive(final Student student) {
            return student.getGender().getDefaultPronouns().getPossessive(student);
        }

        @Override
        public String getSubjective(final Student student) {
            return student.getGender().getDefaultPronouns().getSubjective(student);
        }

        @Override
        public String getObjective(final Student student) {
            return student.getGender().getDefaultPronouns().getObjective(student);
        }
    };

    /**
     *
     * @param student the student of which the pronouns can be gotten
     * @return The possessive pronoun of the student.
     */
    public abstract String getPossessive(Student student);

    /**
     *
     * @param student the student of which the pronouns can be gotten
     * @return The subjective pronoun of the student.
     */
    public abstract String getSubjective(Student student);

    /**
     *
     * @param student the student of which the pronouns can be gotten
     * @return The objective pronoun of the student
     */
    public abstract String getObjective(Student student);
}