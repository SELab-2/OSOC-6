package com.osoc6.OSOC6.database.models.student;

public enum PronounsType {
    SHE {
        @Override
        public String getPossessive(Student student) {
            return "hers";
        }

        @Override
        public String getSubjective(Student student) {
            return "she";
        }

        @Override
        public String getObjective(Student student) {
            return "her";
        }
    },
    HE {
        @Override
        public String getPossessive(Student student) {
            return "his";
        }

        @Override
        public String getSubjective(Student student) {
            return "he";
        }

        @Override
        public String getObjective(Student student) {
            return "him";
        }
    },
    THEY {
        @Override
        public String getPossessive(Student student) {
            return "theirs";
        }

        @Override
        public String getSubjective(Student student) {
            return "they";
        }

        @Override
        public String getObjective(Student student) {
            return "them";
        }
    },
    ZE {
        @Override
        public String getPossessive(Student student) {
            return "hir";
        }

        @Override
        public String getSubjective(Student student) {
            return "ze";
        }

        @Override
        public String getObjective(Student student) {
            return "hir";
        }
    },
    FIRSTNAME {
        @Override
        public String getPossessive(Student student) {
            return student.getFirstName();
        }

        @Override
        public String getSubjective(Student student) {
            return student.getFirstName();
        }

        @Override
        public String getObjective(Student student) {
            return student.getFirstName();
        }
    },
    CALLNAME {
        @Override
        public String getPossessive(Student student) {
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }

        @Override
        public String getSubjective(Student student) {
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }

        @Override
        public String getObjective(Student student) {
            if (student.getCallnameType() == CallnameType.FULLNAME) {
                return student.getFirstName() + " " + student.getLastName();
            } else {
                return student.getCallname();
            }
        }
    },
    OTHER {
        @Override
        public String getPossessive(Student student) {
            return student.getPronouns().get(2);
        }

        @Override
        public String getSubjective(Student student) {
            return student.getPronouns().get(0);
        }

        @Override
        public String getObjective(Student student) {
            return student.getPronouns().get(1);
        }
    },
    NONE {
        @Override
        public String getPossessive (Student student){
            return "";
        }

        @Override
        public String getSubjective (Student student){
            return "";
        }

        @Override
        public String getObjective (Student student){
            return "";
        }
    };

    public abstract String getPossessive(Student student);
    public abstract String getSubjective(Student student);
    public abstract String getObjective(Student student);
}
