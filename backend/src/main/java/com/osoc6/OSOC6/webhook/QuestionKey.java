package com.osoc6.OSOC6.webhook;

import com.osoc6.OSOC6.entities.student.EnglishProficiency;
import com.osoc6.OSOC6.entities.student.Gender;
import com.osoc6.OSOC6.entities.student.OsocExperience;
import com.osoc6.OSOC6.entities.student.Student;
import com.osoc6.OSOC6.exception.WebhookException;

import java.util.List;

/**
 * This enum holds all questions used to fill in a new {@link Student}.
 * Every QuestionKey enum object has its own addToStudent method
 * which extracts the answer from its given form field and adds it to the given student.
 */
public enum QuestionKey {
    /**
     * Are you able to work 128 hours with a student employment agreement, or as a volunteer?.
     */
    WORK_TYPE {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setWorkType((String) formField.getValue());
        }
    },
    /**
     * Are there any responsibilities you might have which could hinder you during the day?
     */
    DAY_RESPONSIBILITIES {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setDaytimeResponsibilities((String) formField.getValue());
            }
        }
    },
    /**
     * Birth name.
     */
    BIRTH_NAME {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setFirstName((String) formField.getValue());
        }
    },
    /**
     * Last name.
     */
    LAST_NAME {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setLastName((String) formField.getValue());
        }
    },
    /**
     * How would you like to be called?
     */
    CALL_NAME {
        /**
         * If the student specified a callName, use the specified one.
         * Otherwise, the callName is set to a combination of their first and last name.
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
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
    GENDER {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            String optionValue = formField.getMatchingOptionValue();
            student.setGender(Gender.fromText(optionValue));
        }
    },
    /**
     * Which pronouns do you prefer?
     */
    WHICH_PRONOUNS {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setPronouns((String) formField.getValue());
            }
        }
    },
    /**
     * Enter your pronouns.
     */
    OTHER_PRONOUNS {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setPronouns((String) formField.getValue());
            }
        }
    },
    /**
     * What language are you most fluent in?
     */
    WHICH_LANGUAGE {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setMostFluentLanguage((String) formField.getValue());
        }
    },
    /**
     * What language are you most fluent in?
     */
    OTHER_LANGUAGE {
        /**
         * Only set the most fluent language here if the student specified a 'other' language.
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setMostFluentLanguage((String) formField.getValue());
            }
        }
    },
    /**
     * How would you rate your English?
     */
    RATE_ENGLISH {
        /**
         * We determine the student's English proficiency
         * by counting the amount of stars in the multiple choice answer.
         * @throws WebhookException if there are no stars, or too many stars
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            String optionValue = formField.getMatchingOptionValue();
            int starCount = (int) optionValue.chars().filter(ch -> ch == '★').count();
            if (0 < starCount && starCount <= EnglishProficiency.values().length) {
                EnglishProficiency proficiency = EnglishProficiency.values()[starCount - 1];
                student.setEnglishProficiency(proficiency);
            } else {
                throw new WebhookException(
                        String.format("Unable to process english proficiency of value '%s'.", optionValue));
            }
        }
    },
    /**
     * Phone number.
     */
    PHONE_NUMBER {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setPhoneNumber((String) formField.getValue());
        }
    },
    /**
     * Your email address.
     */
    EMAIL_ADDRESS {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setEmail((String) formField.getValue());
        }
    },
    /**
     * Upload your CV – size limit 10MB.
     */
    UPLOAD_CV {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCurriculumVitaeURI(formField.getUrlFromValue());
            }
        }
    },
    /**
     * Or link to your CV.
     */
    LINK_CV {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCurriculumVitaeURI((String) formField.getValue());
            }
        }
    },
    /**
     * Upload your portfolio – size limit 10MB.
     */
    UPLOAD_PORTFOLIO {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setPortfolioURI(formField.getUrlFromValue());
            }
        }
    },
    /**
     * Or link to your portfolio / GitHub.
     */
    LINK_PORTOFLIO {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setPortfolioURI((String) formField.getValue());
            }
        }
    },
    /**
     * Upload your motivation – size limit 10MB.
     */
    UPLOAD_MOTIVATION {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setMotivationURI(formField.getUrlFromValue());
            }
        }
    },
    /**
     * Or link to your motivation.
     */
    LINK_MOTIVATION {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setMotivationURI((String) formField.getValue());
            }
        }
    },
    /**
     * Or write about your motivation.
     */
    WRITE_MOTIVATION {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setWrittenMotivation((String) formField.getValue());
            }
        }
    },
    /**
     * Add a fun fact about yourself.
     */
    FUN_FACT {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setFunFact((String) formField.getValue());
        }
    },
    /**
     * What do/did you study?
     */
    STUDY {
        /**
         * Add all chosen studies to the list of the student's studies, except for the 'Other' study.
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            List<String> studies = formField.getAllNonOtherMatchingOptionValues();
            student.getStudies().addAll(studies);
        }
    },
    /**
     * What do/did you study?
     */
    OTHER_STUDY {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.getStudies().add((String) formField.getValue());
            }
        }
    },
    /**
     * What kind of diploma are you currently going for?
     */
    DIPLOMA {
        /**
         * In the form, this question is a checkbox question, but it only allows one answer...
         * So this means that the value of the formField is a list.
         * We also do not want to set the student's diploma to 'Other'.
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            List<String> diplomas = formField.getAllNonOtherMatchingOptionValues();
            if (diplomas.size() > 0) {
                student.setCurrentDiploma(diplomas.get(0));
            }
        }
    },
    /**
     * What kind of diploma are you currently going for?
     */
    OTHER_DIPLOMA {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setCurrentDiploma((String) formField.getValue());
            }
        }
    },
    /**
     * How many years does your degree take?
     */
    TOTAL_DEGREE_YEARS {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setDurationCurrentDegree((Integer) formField.getValue());
            }
        }
    },
    /**
     * Which year of your degree are you in?
     */
    CURRENT_DEGREE_YEAR {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setYearInCourse((String) formField.getValue());
            }
        }
    },
    /**
     * What is the name of your college or university?
     */
    COLLEGE_NAME {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.setInstitutionName((String) formField.getValue());
            }
        }
    },
    /**
     * Which role are you applying for?
     */
    ROLES {
        /**
         * Add all chosen roles/skills to the list of the student's skills, except for the 'Other' role/skill.
         */
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            List<String> skills = formField.getAllNonOtherMatchingOptionValues();
            student.getSkills().addAll(skills);
        }
    },
    /**
     * Which role are you applying for that is not in the list above?
     */
    OTHER_ROLE {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                student.getSkills().add((String) formField.getValue());
            }
        }
    },
    /**
     * Which skill would you list as your best one?
     */
    BEST_SKILL {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            student.setBestSkill((String) formField.getValue());
        }
    },
    /**
     * Have you participated in osoc before?
     */
    OSOC_EXPERIENCE {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            String participationValue = formField.getMatchingOptionValue();
            OsocExperience osocExperience = OsocExperience.fromParticipation(participationValue);
            student.setOsocExperience(osocExperience);
        }
    },
    /**
     * Would you like to be a student coach this year?
     */
    STUDENT_COACH {
        @Override
        public void addToStudent(final FormField formField, final Student student) {
            if (formField.getValue() != null) {
                String studentCoachValue = formField.getMatchingOptionValue();
                OsocExperience osocExperience = OsocExperience.fromStudentCoach(studentCoachValue);
                student.setOsocExperience(osocExperience);
            }
        }
    };
    /**
     * Add the answer from the given form field to the given student.
     * @param formField the field to get the answer from
     * @param student the student to add the answer to
     */
    public abstract void addToStudent(FormField formField, Student student);
}
