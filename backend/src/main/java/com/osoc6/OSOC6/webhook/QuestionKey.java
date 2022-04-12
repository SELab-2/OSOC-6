package com.osoc6.OSOC6.webhook;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.exception.WebhookException;

import java.util.List;

/**
 * This enum holds all questions used to fill in a new {@link Student}.
 * Every QuestionKey enum object has it's own addToStudent method
 * which extracts the answer from it's and adds it to the student.
 */
public enum QuestionKey {
    /**
     * Are you able to work 128 hours with a student employment agreement, or as a volunteer?*.
     */
    WORK_TIME("question_mB7WR7") {
        // TODO toevoegen aan student?
        @Override
        public void addToStudent(final WebhookField formField, final Student student) { }
    },
    /**
     * Are there any responsibilities you might have which could hinder you during the day?
     */
    DAY_RESPONSIBILITIES("question_wvY59A") {
        // TODO toevoegen aan student?
        @Override
        public void addToStudent(final WebhookField formField, final Student student) { }
    },
    /**
     * Birth name.
     */
    BIRTH_NAME("question_mK1KjM") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setFirstName((String) formField.getValue());
        }
    },
    /**
     * Last name.
     */
    LAST_NAME("question_wLpL2G") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setLastName((String) formField.getValue());
        }
    },
    /**
     * How would you like to be called?
     */
    DIFFERENT_NAME("question_31VoaM") {
        /**
         * If the student specified a callName, use the specified one.
         * Otherwise, the callName is set to a combination of their first and last name.
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCallName((String) formField.getValue());
            } else {
                student.setCallName(student.getFirstName() + " " + student.getLastName());
            }
        }
    },
    /**
     * What is your gender?
     */
    GENDER("question_wMRpxY") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            String optionValue = formField.getMatchingOptionValue();
            student.setGender(Gender.fromText(optionValue));
        }
    },
    /**
     * Would you like to add your pronouns?
     */
    WANT_PRONOUNS("question_mJzv4J") {
        // TODO mag deze questionkey weg? (doe null check op het echte veld zelf)
        @Override
        public void addToStudent(final WebhookField formField, final Student student) { }
    },
    /**
     * Which pronouns do you prefer?
     */
    WHICH_PRONOUNS("question_wgG6oN") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO implementeren na development merge
        }
    },
    /**
     * Enter your pronouns.
     */
    OTHER_PRONOUNS("question_3yY5a0") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO implementeren na development merge
        }
    },
    /**
     * What language are you most fluent in?
     */
    WHICH_LANGUAGE("question_3X0PbO") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setMostFluentLanguage((String) formField.getValue());
        }
    },
    /**
     * What language are you most fluent in?
     */
    OTHER_LANGUAGE("question_w8x4lA") {
        /**
         * Only set the most fluent language here if the student specified a 'other' language.
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setMostFluentLanguage((String) formField.getValue());
            }
        }
    },
    /**
     * How would you rate your English?
     */
    RATE_ENGLISH("question_n0ORWZ") {
        /**
         * We determine the student's English proficiency
         * by counting the amount of starts in the multiple choice answer.
         * @throws WebhookException if there are no stars, or too many stars
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            String optionValue = formField.getMatchingOptionValue();
            int starCount = (int) optionValue.chars().filter(ch -> ch == '★').count();
            if (0 < starCount && starCount <= EnglishProficiency.values().length) {
                EnglishProficiency proficiency = EnglishProficiency.values()[starCount];
                student.setEnglishProficiency(proficiency);
            }
            throw new WebhookException(
                    String.format("English proficiency of value %s does not exist.", optionValue));
        }
    },
    /**
     * Phone number.
     */
    PHONE_NUMBER("question_wzY561") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setPhoneNumber((String) formField.getValue());
        }
    },
    /**
     * Your email address.
     */
    EMAIL_ADDRESS("question_w5xPAM") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setEmail((String) formField.getValue());
        }
    },
    /**
     * Upload your CV – size limit 10MB.
     */
    UPLOAD_CV("question_wddeyz") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO uitzoeken hoe dit werkt
        }
    },
    /**
     * Or link to your CV.
     */
    LINK_CV("question_mYalAq") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCurriculumVitaeURI((String) formField.getValue());
            }
        }
    },
    /**
     * Upload your portfolio – size limit 10MB.
     */
    UPLOAD_PORTFOLIO("question_mDz6Gb") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            //Todo uitzoeken hoe dit werkt
        }
    },
    /**
     * Or link to your portfolio / GitHub.
     */
    LINK_PORTOFLIO("question_3lrkE5") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setPortfolioURI((String) formField.getValue());
            }
        }
    },
    /**
     * Upload your motivation – size limit 10MB.
     */
    UPLOAD_MOTIVATION("question_mRPy9l") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO uitzoeken hoe dit werkt
        }
    },
    /**
     * Or link to your motivation.
     */
    LINK_MOTIVATION("question_woGLj1") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setMotivationURI((String) formField.getValue());
            }
        }
    },
    /**
     * Or write about your motivation.
     */
    WRITE_MOTIVATION("question_nGlAPj") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setWrittenMotivation((String) formField.getValue());
            }
        }
    },
    /**
     * Add a fun fact about yourself.
     */
    FUN_FACT("question_mOGMNK") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO uncomment this after merge
//            student.setFunFact((String) formField.getValue());
        }
    },
    /**
     * What do/did you study?
     */
    STUDY("question_mVJO6a") {
        /**
         * Add all chosen studies to the list of the student's studies, except for the 'Other' study.
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            List<String> studies = formField.getAllNonOtherMatchingOptionValues();
            student.getStudies().addAll(studies);
        }
    },
    /**
     * What do/did you study?
     */
    OTHER_STUDY("question_nPOJqQ") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.getStudies().add((String) formField.getValue());
            }
        }
    },
    /**
     * What kind of diploma are you currently going for?
     */
    DIPLOMA("question_3EW7Oo") {
        /**
         * In the form, this question is a checkbox question, but it only allows one answer...
         * So this means that the value of the formField is a list.
         * We also do not want to set the student's diploma to 'Other'.
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            List<String> diplomas = formField.getAllNonOtherMatchingOptionValues();
            if (diplomas.size() > 0) {
                student.setCurrentDiploma(diplomas.get(0));
            }
        }
    },
    /**
     * What kind of diploma are you currently going for?
     */
    OTHER_DIPLOMA("question_nrPMZM") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCurrentDiploma((String) formField.getValue());
            }
        }
    },
    /**
     * How many years does your degree take?
     */
    TOTAL_DEGREE_YEARS("question_w4rVbb") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setDurationCurrentDegree((Integer) formField.getValue());
        }
    },
    /**
     * Which year of your degree are you in?
     */
    CURRENT_DEGREE_YEAR("question_3jPAVR") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setYearInCourse((String) formField.getValue());
        }
    },
    /**
     * What is the name of your college or university?
     */
    COLLEGE_NAME("question_w2PG6p") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            // TODO test of hier een nullcheck bij moet, want als study = self taught dan kan dit null zijn
            student.setInstitutionName((String) formField.getValue());
        }
    },
    /**
     * Which role are you applying for?
     */
    ROLES("question_3xY5WG") {
        /**
         * Add all chosen roles/skills to the list of the student's skills, except for the 'Other' role/skill.
         */
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            List<String> skills = formField.getAllNonOtherMatchingOptionValues();
            student.getSkills().addAll(skills);
        }
    },
    /**
     * Which role are you applying for that is not in the list above?
     */
    OTHER_ROLE("question_mZarB0") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                student.getSkills().add((String) formField.getValue());
            }
        }
    },
    /**
     * Which skill would you list as your best one?
     */
    BEST_SKILL("question_3No1ZG") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            student.setBestSkill((String) formField.getValue());
        }
    },
    /**
     * Have you participated in osoc before?
     */
    OSOC_EXPERIENCE("question_3qV1l2") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            OsocExperience osocExperience = OsocExperience.fromParticipation((String) formField.getValue());
            student.setOsocExperience(osocExperience);
        }
    },
    /**
     * Would you like to be a student coach this year?
     */
    STUDENT_COACH("question_wQVlQg") {
        @Override
        public void addToStudent(final WebhookField formField, final Student student) {
            if (formField.getValue() != null) {
                OsocExperience osocExperience = OsocExperience.fromStudentCoach((String) formField.getValue());
                student.setOsocExperience(osocExperience);
            }
        }
    };


    /**
     * The key of the question.
     * When adding new questions, make sure the key matches the key of the corresponding tally question.
     */
    private final String key;

    /**
     * Add the answer from the given form field to the given student.
     * @param formField the field to get the answer from
     * @param student the student to add the answer to
     */
    public abstract void addToStudent(WebhookField formField, Student student);

    QuestionKey(final String newKey) {
        key = newKey;
    }

    /**
     * Parse a string into a QuestionKey enum object.
     * @param text the string to parse
     * @return the corresponding QuestionKey enum, or null if the key is not found
     */
    @JsonCreator
    public static QuestionKey fromText(final String text) {
        for (QuestionKey questionKey : QuestionKey.values()) {
            if (questionKey.key.equals(text)) {
                return questionKey;
            }
        }
        // If the key does not exist.
        return null;
    }
}
