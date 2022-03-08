package com.osoc6.OSOC6.database.models.student;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.GenerationType;
import java.net.URI;
import java.util.List;

@Entity
public class Student {
    /**
     * The email of the student.
     */
    private String email;

    /**
     * The first name of the student.
     */
    private String firstName;

    /**
     * The last name of the student.
     */
    private String lastName;

    /**
     * The gender of the student.
     */
    private Gender gender;

    /**
     * The PronounsType of the student.
     */
    private PronounsType pronounsType;

    /**
     * The callName of the student.
     * Special case: If callName is the empty string, the student's callName is their birth name.
     */
    private String callName;

    //private Role projectRole;

    /**
     * The pronouns of the student.
     */
    @ElementCollection
    private List<String> pronouns;

    /**
     * The most fluent language of a person. This is a formatted string.
     */
    private String mostFluentLanguage;

    /**
     * English proficiency rating of a student as described in @{@link EnglishProficiency}.
     */
    private EnglishProficiency englishProficiency;

    /**
     * Formatted string checking the phone number of a student.
     */
    private String phoneNumber;

    /**
     * A URI pointing to the CV of a student.
     */
    private URI curriculumVitaeURI;

    /**
     * A URI pointing to the portfolio of the student.
     */
    private URI portfolioURI;

    /**
     * A URI pointing to the motivation of the student.
     */
    private URI motivationURI;

    /**
     * A written motivation of the student.
     */
    private String writtenMotivation;

    /**
     * Highest level of education a student currently has.
     */
    private String educationLevel;

    /**
     * Diploma a student is trying to get.
     */
    private String currentDiploma;

    /**
     * Amount of years getting the current degree takes.
     */
    private int durationCurrentDegree;

    /**
     * What year the student is in the course.
     * In the form this is a string because you can say already finished.
     * We can not modulate it as a string because both 'already finished' and last year are possibilities.
     * We can therefor not just convert to an int because there are many ways to state these facts.
     */
    private String yearInCourse;

    /**
     * Name of the collage/ university student is enrolled.
     */
    private String institutionName;

    /**
     * The skill the student would describe to be their best.
     */
    private String bestSkill;

    /**
     * Level of OSoc experience as described in @{@link OsocExperience}.
     */
    private OsocExperience osocExperience;

    // relationship with a Skill. In the form this is called the 'role' a student applies for

    // relationship with Study

    /**
     * Additional info that coaches or admins write about students.
     */
    private String additionalStudentInfo;

    /**
     * The id of the student.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     *
     * @return the email of the student
     */
    public String getEmail() {
        return email;
    }

    /**
     *
     * @return the first name of the student
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     *
     * @return the last name of the student
     */
    public String getLastName() {
        return lastName;
    }

    /**
     *
     * @return gender of student
     */
    public Gender getGender() {
        return gender;
    }

    /**
     *
     * @return the PronounsType of the student
     */
    public PronounsType getPronounsType() {
        return pronounsType;
    }

    /**
     *
     * @return the pronouns of the student
     */
    public List<String> getPronouns() {
        return pronouns;
    }

    /**
     *
     * @return the call name of the student
     */
    public String getCallName() {
        if (callName.isEmpty()) {
            return getFirstName() + " " + getLastName();
        } else {
            return callName;
        }
    }

    /**
     *
     * @return formatted string language that the student is most fluent in.
     */
    public String getMostFluentLanguage() {
        return mostFluentLanguage;
    }

    /**
     *
     * @return English proficiency rating of a student as described in @{@link EnglishProficiency}
     */
    public EnglishProficiency getEnglishProficiency() {
        return englishProficiency;
    }

    /**
     *
     * @return phone number of student
     */
    public String getPhoneNumber() {
        return phoneNumber;
    }

    /**
     *
     * @return URI pointing to the CV of a student.
     */
    public URI getCurriculumVitaeURI() {
        return curriculumVitaeURI;
    }

    /**
     *
     * @return URI pointing to the portfolio of the student
     */
    public URI getPortfolioURI() {
        return portfolioURI;
    }

    /**
     *
     * @return URI pointing to the motivation of the student
     */
    public URI getMotivationURI() {
        return motivationURI;
    }

    /**
     *
     * @return Written motivation of the student
     */
    public String getWrittenMotivation() {
        return writtenMotivation;
    }

    /**
     *
     * @return Highest level of education a student currently has
     */
    public String getEducationLevel() {
        return educationLevel;
    }

    /**
     *
     * @return Diploma a student is trying to get.
     */
    public String getCurrentDiploma() {
        return currentDiploma;
    }

    /**
     *
     * @return Amount of years getting the current degree takes
     */
    public int getDurationCurrentDegree() {
        return durationCurrentDegree;
    }

    /**
     *
     * @return What year the student is in the course.
     */
    public String getYearInCourse() {
        return yearInCourse;
    }

    /**
     *
     * @return Name of the collage/ university student is enrolled.
     */
    public String getInstitutionName() {
        return institutionName;
    }

    /**
     *
     * @return The skill the student would describe to be their best.
     */
    public String getBestSkill() {
        return bestSkill;
    }

    /**
     *
     * @return Level of OSoc experience as described in @{@link OsocExperience}.
     */
    public OsocExperience getOsocExperience() {
        return osocExperience;
    }

    /**
     *
     * @return Additional info that coaches or admins write about students
     */
    public String getAdditionalStudentInfo() {
        return additionalStudentInfo;
    }
}
