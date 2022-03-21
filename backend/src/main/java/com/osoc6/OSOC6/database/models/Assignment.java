package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
@NoArgsConstructor
public class Assignment {
    /**
     * The id of the Assignment.
     */
    @Id
    @GeneratedValue
    private Long id;

    /**
     * whether assignment is a suggestion (if false this is a definitive assignment made by an admin).
     */
    @Basic(optional = false)
    @Getter @Setter
    private boolean isSuggestion;

    /**
     * The creation timestamp of the assignment.
     */
    @Basic(optional = false)
    @Getter
    private Timestamp timestamp = new Timestamp(System.currentTimeMillis());

    /**
     * The reason the student got assigned.
     */
    @Basic(optional = false)
    @Lob
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
    @Getter
    private Student student;

    /**
     * Project that the student is assigned to.
     */
    @ManyToOne(optional = false)
    @Getter
    private Project project;

    /**
     *
     * @param newIsSuggestion whether or not this assignment is just a suggestion
     * @param newReason the reason for this assignment
     * @param newAssigner the assigner related to this assignment
     * @param newStudent the student who is assigned
     * @param newProject the project the assignment belongs to
     */
    public Assignment(final boolean newIsSuggestion, final String newReason,
                      final UserEntity newAssigner, final Student newStudent, final Project newProject) {
        super();
        isSuggestion = newIsSuggestion;
        reason = newReason;
        assigner = newAssigner;
        student = newStudent;
        project = newProject;
    }
}
