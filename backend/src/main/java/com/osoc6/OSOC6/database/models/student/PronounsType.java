package com.osoc6.OSOC6.database.models.student;

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
            return student.getFirstName();
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
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }

        @Override
        public String getSubjective(final Student student) {
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }

        @Override
        public String getObjective(final Student student) {
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }
    },
    /**
     * For people who prefer other pronouns.
     */
    OTHER {
        @Override
        public String getPossessive(final Student student) {
            return student.getPronouns().get(2);
        }

        @Override
        public String getSubjective(final Student student) {
            return student.getPronouns().get(0);
        }

        @Override
        public String getObjective(final Student student) {
            return student.getPronouns().get(1);
        }
    },
    /**
     * For people who prefer no pronouns.
     */
    NONE {
        @Override
        public String getPossessive(final Student student) {
            return "";
        }

        @Override
        public String getSubjective(final Student student) {
            return "";
        }

        @Override
        public String getObjective(final Student student) {
            return "";
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
