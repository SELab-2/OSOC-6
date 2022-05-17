package com.osoc6.OSOC6.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.entities.student.Student;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;

/**
 * The database entity for an Assignment.
 * An Assignment is the registration of a user assigning a {@link Student}
 * on a {@link Project}.
 * The assignment can be invalid, this means the assignment was performed but is no longer looked at.
 * The assignment can be non-suggestive, this means the project of this assignment has been locked.
 * Every assignment has a reason.
 */
@Entity
@NoArgsConstructor
public final class Assignment implements WeakToEdition {
    /**
     * The id of the Assignment.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    /**
     * whether assignment is a suggestion (if false this is a definitive assignment made by an admin).
     */
    @Basic(optional = false)
    @NotNull @Getter @Setter
    private Boolean isSuggestion;

    /**
     * Whether assignment is still valid.
     * An assignment can be invalid after conflict resolution.
     * This means we no longer recognise it.
     * A coach can edit this field in their own suggestions since this is the same as making the assignment again.
     */
    @Basic(optional = false)
    @NotNull @Getter @Setter
    private Boolean isValid = true;

    /**
     * The creation timestamp of the assignment.
     */
    @Basic(optional = false)
    @Getter
    @CreationTimestamp @ReadOnlyProperty
    private Timestamp timestamp;

    /**
     * The reason the student got assigned.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String reason;

    /**
     * The {@link UserEntity}/ Admin that executed the assignment.
     */
    @ManyToOne(optional = false)
    @Getter
    private UserEntity assigner;

    /**
     * Student that gets assigned.
     * Fetch lazy because a student is a very big entity
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    @Getter
    private Student student;

    /**
     * {@link ProjectSkill} that the student is assigned to.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "project_skill_id", referencedColumnName = "id")
    @Getter
    private ProjectSkill projectSkill;

    /**
     *
     * @param newIsSuggestion whether or not this assignment is just a suggestion
     * @param newReason the reason for this assignment
     * @param newAssigner the assigner related to this assignment
     * @param newStudent the student who is assigned
     * @param newProjectSkill the projectSkill the assignment belongs to
     */
    public Assignment(final boolean newIsSuggestion, final String newReason,
                      final UserEntity newAssigner, final Student newStudent, final ProjectSkill newProjectSkill) {
        super();
        isSuggestion = newIsSuggestion;
        reason = newReason;
        assigner = newAssigner;
        student = newStudent;
        projectSkill = newProjectSkill;
    }

    @Override @JsonIgnore
    public Edition getControllingEdition() {
        return projectSkill.getControllingEdition();
    }
}
