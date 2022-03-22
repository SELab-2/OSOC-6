package com.osoc6.OSOC6.database.models.student;

import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.RadagastNumberWizard;
import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.database.models.Suggestion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Singular;

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

/**
 * The database entity for a Student.
 * A student is the main data point of our tool. There are a lot of things a student holds.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_id")})
@NoArgsConstructor
@Builder @AllArgsConstructor
public class Student {
    /**
     * The id of the student.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    /**
     * The email of the student.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.EMAIL_LENGTH)
    @Getter @Setter
    private String email;

    /**
     * The first name of the student.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.FIRST_NAME_LENGTH)
    @Getter @Setter
    private String firstName;

    /**
     * The last name of the student.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.LAST_NAME_LENGTH)
    @Getter @Setter
    private String lastName;

    /**
     * The gender of the student.
     */
    @Basic(optional = false)
    @Getter @Setter
    private Gender gender;

    /**
     * The PronounsType of the student.
     */
    @Basic(optional = false)
    @Getter
    private PronounsType pronounsType;

    /**
     * The callName of the student.
     * Special case: If callName is the empty string, the student's callName is their birth name.
     */
    @Basic(optional = true)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    private String callName;

    /**
     * The pronouns of the student.
     */
    @ElementCollection
    @Getter
    private List<String> pronouns;

    /**
     * The most fluent language of a person. This is a formatted string.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String mostFluentLanguage;

    /**
     * English proficiency rating of a student as described in @{@link EnglishProficiency}.
     */
    @Basic(optional = false)
    @Getter @Setter
    private EnglishProficiency englishProficiency;

    /**
     * Formatted string checking the phone number of a student.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.PHONE_NUMBER_LENGTH)
    @Getter
    private String phoneNumber;

    /**
     * A URI pointing to the CV of a student.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI curriculumVitaeURI;

    /**
     * A URI pointing to the portfolio of the student.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI portfolioURI;

    /**
     * A URI pointing to the motivation of the student.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI motivationURI;

    /**
     * A written motivation of the student.
     */
    @Basic
    @Lob
    @Getter @Setter
    private String writtenMotivation;

    /**
     * Highest level of education a student currently has.
     * Represented as string instead of enum because only one choice can be provided and other is an option.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String educationLevel;

    /**
     * Diploma a student is trying to get.
     */

    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String currentDiploma;

    /**
     * Amount of years getting the current degree takes.
     */
    @Basic(optional = false)
    @Getter @Setter
    private int durationCurrentDegree;

    /**
     * What year the student is in the course.
     * In the form this is a string because you can say already finished.
     * We can not modulate it as a string because both 'already finished' and last year are possibilities.
     * We can therefor not just convert to an int because there are many ways to state these facts.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String yearInCourse;

    /**
     * Name of the collage/ university student is enrolled.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String institutionName;

    /**
     * The skill the student would describe to be their best.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String bestSkill;

    /**
     * Level of OSoc experience as described in @{@link OsocExperience}.
     */
    @Basic(optional = false)
    @Getter @Setter
    private OsocExperience osocExperience;

    /**
     * Additional info that coaches or admins write about students.
     */
    @Basic(optional = false)
    @Lob
    @Getter @Setter
    private String additionalStudentInfo;

    /**
     * {@link Edition} in which this communication took place.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private Edition edition;

    /**
     * The Studies this student has done.
     */
    @OneToMany(orphanRemoval = true)
    @Getter @Singular
    private Set<Study> studies;

    /**
     * The skills this student has.
     * In the form this is called the 'role' a student applies for.
     */
    @OneToMany(orphanRemoval = true)
    @Getter @Singular
    private Set<Skill> skills;

    /**
     * The suggestions made about this student.
     */
    @OneToMany(orphanRemoval = true)
    @Getter @Singular
    private Set<Suggestion> suggestions;

    /**
     * Communication that this student has received sorted on the timestamp.
     */
    @OneToMany(mappedBy = "student", orphanRemoval = true)
    @OrderColumn(name = "timestamp")
    @Getter @Singular
    private List<Communication> communications;

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
     * @param newCallName that should be set as the callName of this student.
     *                    if empty, this defaults to the first name and the last name.
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
     * @param newPhoneNumber that should be set as the phone number of this student
     */
    public void setPhoneNumber(final String newPhoneNumber) {
        // Check if phone number is correct
        phoneNumber = newPhoneNumber;
    }
}
