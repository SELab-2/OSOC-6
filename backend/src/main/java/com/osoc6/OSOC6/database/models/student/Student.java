package com.osoc6.OSOC6.database.models.student;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.WeakToEdition;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * The database entity for a Student.
 * A student is the main data point of our tool. There are a lot of things a student holds.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_id")})
@NoArgsConstructor
@Builder @AllArgsConstructor
public final class Student implements WeakToEdition {
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
    @Getter @Setter
    private PronounsType pronounsType;

    /**
     * The callName of the student.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String callName;

    /**
     * The pronouns of the student.
     */
    @ElementCollection
    @Getter @Setter @Builder.Default
    private List<String> pronouns = new ArrayList<>();

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
    @Getter @Setter
    private String phoneNumber;

    /**
     * A URI pointing to the CV of a student.
     */
    @Basic
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String curriculumVitaeURI;

    /**
     * A URI pointing to the portfolio of the student.
     */
    @Basic
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String portfolioURI;

    /**
     * A URI pointing to the motivation of the student.
     */
    @Basic
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String motivationURI;

    /**
     * A written motivation of the student.
     */
    @Basic
    @Column(columnDefinition = "text")
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
    @NotNull @Getter @Setter
    private Integer durationCurrentDegree;

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
     * Level of Osoc experience as described in @{@link OsocExperience}.
     */
    @Basic(optional = false)
    @Getter @Setter
    private OsocExperience osocExperience;

    /**
     * Additional info that coaches or admins write about students.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String additionalStudentInfo;

    /**
     * {@link Edition} in which this communication took place.
     */
    @ManyToOne(optional = false, cascade = {})
    @ReadOnlyProperty
    @Getter
    private Edition edition;

    /**
     * The Studies this student has done.
     */
    @ElementCollection
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter @Setter @Builder.Default
    private List<String> studies = new ArrayList<>();

    /**
     * The skills this student has.
     * In the form this is called the 'role' a student applies for.
     */
    @ElementCollection
    @Column(columnDefinition = "text")
    @Getter @Setter @Builder.Default
    private List<String> skills = new ArrayList<>();

    /**
     * The suggestions made about this student.
     */
    @OneToMany(orphanRemoval = true, mappedBy = "student")
    @Getter @Setter @Builder.Default
    private List<Suggestion> suggestions = new ArrayList<>();

    /**
     * The assignments made about this student.
     */
    @OneToMany(orphanRemoval = true, mappedBy = "student", cascade = {CascadeType.REMOVE})
    @Getter @Setter @Builder.Default
    private List<Assignment> assignments = new ArrayList<>();

    /**
     * Communication that this student has received sorted on the timestamp.
     */
    @OneToMany(mappedBy = "student", orphanRemoval = true, cascade = {CascadeType.REMOVE})
    @OrderColumn(name = "timestamp")
    @Getter @Setter @Builder.Default
    private List<Communication> communications = new ArrayList<>();

    /**
     *
     * @return The possessive pronoun of the student.
     */
    public String getPossessivePronoun() {
        return pronounsType.getPossessive(this);
    }

    /**
     *
     * @return The subjective pronoun of the student.
     */
    public String getSubjectivePronoun() {
        return pronounsType.getSubjective(this);
    }

    /**
     *
     * @return The objective pronoun of the student
     */
    public String getObjectivePronoun() {
        return pronounsType.getObjective(this);
    }

    @Override @JsonIgnore
    public Edition getControllingEdition() {
        return edition;
    }
}
