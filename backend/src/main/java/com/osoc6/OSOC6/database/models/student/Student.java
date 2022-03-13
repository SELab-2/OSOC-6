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
     * The id of the student.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

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
     * Represented as string instead of enum because only one choice can be provided and other is an option.
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
     * Student's default no-arg constructor
     */
    public Student() {}

    /**
     *
     * @param email the email of the student
     * @param firstName the first name of the student
     * @param lastName the last name of the student
     * @param gender the gender of the student
     * @param pronounsType the pronounsType of the student
     * @param callName the callname of the student
     * @param pronouns the pronouns of the student
     * @param mostFluentLanguage the language in which the student is moest fluent
     * @param englishProficiency the student's proficiency in English
     * @param phoneNumber the phone number of the student
     * @param curriculumVitaeURI the URI of the student's curriculum vitae
     * @param portfolioURI the URI of the student's portfolio
     * @param motivationURI the URI of the student's motivation
     * @param writtenMotivation the written motivation of the student
     * @param educationLevel the education level of the student
     * @param currentDiploma the current diploma of the student
     * @param durationCurrentDegree the duration of the student's current degree
     * @param yearInCourse the current year (first, second,...) of the student's course
     * @param institutionName the name of the institution of the student's course
     * @param bestSkill the best skill of the student
     * @param osocExperience the level of OSOC-experience of the student
     * @param additionalStudentInfo additional info about the student
     */
    public Student(String email, String firstName, String lastName,
                   Gender gender, PronounsType pronounsType, String callName,
                   List<String> pronouns, String mostFluentLanguage,
                   EnglishProficiency englishProficiency, String phoneNumber,
                   URI curriculumVitaeURI, URI portfolioURI, URI motivationURI,
                   String writtenMotivation, String educationLevel, String currentDiploma,
                   int durationCurrentDegree, String yearInCourse, String institutionName,
                   String bestSkill, OsocExperience osocExperience, String additionalStudentInfo) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.pronounsType = pronounsType;
        this.callName = callName;
        this.pronouns = pronouns;
        this.mostFluentLanguage = mostFluentLanguage;
        this.englishProficiency = englishProficiency;
        this.phoneNumber = phoneNumber;
        this.curriculumVitaeURI = curriculumVitaeURI;
        this.portfolioURI = portfolioURI;
        this.motivationURI = motivationURI;
        this.writtenMotivation = writtenMotivation;
        this.educationLevel = educationLevel;
        this.currentDiploma = currentDiploma;
        this.durationCurrentDegree = durationCurrentDegree;
        this.yearInCourse = yearInCourse;
        this.institutionName = institutionName;
        this.bestSkill = bestSkill;
        this.osocExperience = osocExperience;
        this.additionalStudentInfo = additionalStudentInfo;
    }

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

    /**
     *
     * @param newEmail that should be set as the email of this student
     */
    public void setEmail(final String newEmail) {
        email = newEmail;
    }

    /**
     *
     * @param newFirstName that should be set as the first name of this student
     */
    public void setFirstName(final String newFirstName) {
        firstName = newFirstName;
    }

    /**
     *
     * @param newLastName  that should be set as the last name of this student
     */
    public void setLastName(final String newLastName) {
        lastName = newLastName;
    }

    /**
     *
     * @param newGender that should be set as the gender of this student
     */
    public void setGender(final Gender newGender) {
        gender = newGender;
    }

    /**
     *
     * @param newPronounsType that should be set as the pronouns type of this student
     */
    public void setPronounsType(final PronounsType newPronounsType) {
        pronounsType = newPronounsType;
        if (newPronounsType != PronounsType.OTHER) {
            pronouns.clear();
        }
    }

    /**
     *
     * @param newCallName that should be set as the callName of this student
     */
    public void setCallName(final String newCallName) {
        callName = newCallName;
    }

    /**
     *
     * @param newPronouns that should be set as the pronouns of this student
     */
    public void setPronouns(final List<String> newPronouns) {
        pronounsType = PronounsType.OTHER;
        pronouns = newPronouns;
    }

    /**
     *
     * @param newMostFluentLanguage that should be set as the most fluent language of this student
     */
    public void setMostFluentLanguage(final String newMostFluentLanguage) {
        mostFluentLanguage = newMostFluentLanguage;
    }

    /**
     *
     * @param newEnglishProficiency that should be set as the English proficiency of this student
     */
    public void setEnglishProficiency(final EnglishProficiency newEnglishProficiency) {
        englishProficiency = newEnglishProficiency;
    }

    /**
     *
     * @param newPhoneNumber that should be set as the phone number of this student
     */
    public void setPhoneNumber(final String newPhoneNumber) {
        // Check if phone number is correct
        phoneNumber = newPhoneNumber;
    }

    /**
     *
     * @param newCurriculumVitaeURI that should be set as the CV URI of this student
     */
    public void setCurriculumVitaeURI(final URI newCurriculumVitaeURI) {
        curriculumVitaeURI = newCurriculumVitaeURI;
    }

    /**
     *
     * @param newPortfolioURI that should be set as the portfolio URI of this student
     */
    public void setPortfolioURI(final URI newPortfolioURI) {
        portfolioURI = newPortfolioURI;
    }

    /**
     *
     * @param newMotivationURI that should be set as the motivation URI of this student
     */
    public void setMotivationURI(final URI newMotivationURI) {
        motivationURI = newMotivationURI;
    }

    /**
     *
     * @param newWrittenMotivation that should be set as the written motivation of this student
     */
    public void setWrittenMotivation(final String newWrittenMotivation) {
        writtenMotivation = newWrittenMotivation;
    }

    /**
     *
     * @param newEducationLevel that should be set as the highest level of education of this student
     */
    public void setEducationLevel(final String newEducationLevel) {
        educationLevel = newEducationLevel;
    }

    /**
     *
     * @param newCurrentDiploma that should be set as the diploma the student is aiming to get
     */
    public void setCurrentDiploma(final String newCurrentDiploma) {
        currentDiploma = newCurrentDiploma;
    }

    /**
     *
     * @param newDurationCurrentDegree the time the degree the student is getting takes
     */
    public void setDurationCurrentDegree(final int newDurationCurrentDegree) {
        durationCurrentDegree = newDurationCurrentDegree;
    }

    /**
     *
     * @param newYearInCourse the year the student is already in this course. Example: 1st, second, last, done
     */
    public void setYearInCourse(final String newYearInCourse) {
        yearInCourse = newYearInCourse;
    }

    /**
     *
     * @param newInstitutionName name of the collage/ university student is enrolled.
     */
    public void setInstitutionName(final String newInstitutionName) {
        institutionName = newInstitutionName;
    }

    /**
     *
     * @param newBestSkill skill the student would describe to be their best.
     */
    public void setBestSkill(final String newBestSkill) {
        bestSkill = newBestSkill;
    }

    /**
     *
     * @param newOsocExperience level of OSoc experience as described in @{@link OsocExperience}.
     */
    public void setOsocExperience(final OsocExperience newOsocExperience) {
        osocExperience = newOsocExperience;
    }

    /**
     *
     * @param newAdditionalStudentInfo additional info that coaches or admins write about students.
     */
    public void setAdditionalStudentInfo(final String newAdditionalStudentInfo) {
        additionalStudentInfo = newAdditionalStudentInfo;
    }
}
