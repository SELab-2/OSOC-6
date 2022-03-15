package com.osoc6.OSOC6.database.models.student;

import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.database.models.Suggestion;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import java.net.URI;
import java.util.List;
import java.util.Set;

@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_name")})
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
    @Basic(optional = false)
    @Column(length = 100)
    private String email;

    /**
     * The first name of the student.
     */
    @Basic(optional = false)
    @Column(length = 50)
    private String firstName;

    /**
     * The last name of the student.
     */
    @Basic(optional = false)
    @Column(length = 50)
    private String lastName;

    /**
     * The gender of the student.
     */
    @Basic(optional = false)
    private Gender gender;

    /**
     * The PronounsType of the student.
     */
    @Basic(optional = false)
    private PronounsType pronounsType;

    /**
     * The callName of the student.
     * Special case: If callName is the empty string, the student's callName is their birth name.
     */
    @Basic(optional = true)
    @Column(length = 100)
    private String callName;

    /**
     * The pronouns of the student.
     */
    @ElementCollection
    private List<String> pronouns;

    /**
     * The most fluent language of a person. This is a formatted string.
     */
    @Basic(optional = false)
    @Column(length = 50)
    private String mostFluentLanguage;

    /**
     * English proficiency rating of a student as described in @{@link EnglishProficiency}.
     */
    @Basic(optional = false)
    private EnglishProficiency englishProficiency;

    /**
     * Formatted string checking the phone number of a student.
     */
    @Basic(optional = false)
    @Column(length = 20)
    private String phoneNumber;

    /**
     * A URI pointing to the CV of a student.
     */
    @Basic
    private URI curriculumVitaeURI;

    /**
     * A URI pointing to the portfolio of the student.
     */
    @Basic
    private URI portfolioURI;

    /**
     * A URI pointing to the motivation of the student.
     */
    @Basic
    private URI motivationURI;

    /**
     * A written motivation of the student.
     */
    @Basic
    @Lob
    private String writtenMotivation;

    /**
     * Highest level of education a student currently has.
     * Represented as string instead of enum because only one choice can be provided and other is an option.
     */
    @Basic(optional = false)
    @Column(length = 100)
    private String educationLevel;

    /**
     * Diploma a student is trying to get.
     */

    @Basic(optional = false)
    @Column(length = 100)
    private String currentDiploma;

    /**
     * Amount of years getting the current degree takes.
     */
    @Basic(optional = false)
    private int durationCurrentDegree;

    /**
     * What year the student is in the course.
     * In the form this is a string because you can say already finished.
     * We can not modulate it as a string because both 'already finished' and last year are possibilities.
     * We can therefor not just convert to an int because there are many ways to state these facts.
     */
    @Basic(optional = false)
    @Column(length = 100)
    private String yearInCourse;

    /**
     * Name of the collage/ university student is enrolled.
     */
    @Basic(optional = false)
    @Column(length = 100)
    private String institutionName;

    /**
     * The skill the student would describe to be their best.
     */
    @Basic(optional = false)
    @Column(length = 100)
    private String bestSkill;

    /**
     * Level of OSoc experience as described in @{@link OsocExperience}.
     */
    @Basic(optional = false)
    private OsocExperience osocExperience;

    /**
     * Additional info that coaches or admins write about students.
     */
    @Basic(optional = false)
    @Lob
    private String additionalStudentInfo;

    /**
     * {@link Edition} in which this communication took place.
     */
    @ManyToOne(optional = false)
    private Edition edition;

    /**
     * The Studies this student has done.
     */
    @OneToMany(orphanRemoval = true)
    private Set<Study> studies;

    /**
     * The skills this student has.
     * In the form this is called the 'role' a student applies for.
     */
    @OneToMany(orphanRemoval = true)
    private Set<Skill> skills;

    /**
     * The suggestions made about this student.
     */
    @OneToMany(orphanRemoval = true)
    private Set<Suggestion> suggestions;

    /**
     * Communication that this student has received sorted on the timestamp.
     */
    @OneToMany(mappedBy = "student", orphanRemoval = true)
    @OrderColumn(name = "timestamp")
    private List<Communication> communications;

    /**
     * Student's default no-arg constructor.
     */
    public Student() { }

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
     * @return The Studies this student has done
     */
    public Set<Study> getStudies() {
        return studies;
    }

    /**
     *
     * @return the skills this student has
     */
    public Set<Skill> getSkills() {
        return skills;
    }

    /**
     *
     * @return suggestions made about this student
     */
    public Set<Suggestion> getSuggestions() {
        return suggestions;
    }

    /**
     *
     * @return Communication that this student has received sorted on the timestamp.
     */
    public List<Communication> getCommunications() {
        return communications;
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
