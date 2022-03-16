package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
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
    private boolean isSuggestion;

    /**
     * The creation timestamp of the assignment.
     */
    @Basic(optional = false)
    private Timestamp timestamp;

    /**
     * The reason the student got assigned.
     */
    @Basic(optional = false)
    @Lob
    private String reason;

    /**
     * The {@link User}/ Admin that executed the assignment.
     */
    @ManyToOne(optional = false)
    private User assigner;

    /**
     * Student that gets assigned.
     * Fetch lazy because a student is a very big entity
     */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Student student;

    /**
     * Project that the student is assigned to.
     */
    @ManyToOne(optional = false)
    private Project project;

    /**
     * Assignment's default no-arg constructor.
     */
    public Assignment() { }

    /**
     *
     * @param newIsSuggestion whether or not this assignment is just a suggestion
     * @param newReason the reason for this assignment
     * @param newAssigner the assigner related to this assignment
     * @param newStudent the student who is assigned
     * @param newProject the project the assignment belongs to
     */
    public Assignment(final boolean newIsSuggestion, final String newReason,
                      final User newAssigner, final Student newStudent, final Project newProject) {
        isSuggestion = newIsSuggestion;
        timestamp = new Timestamp(System.currentTimeMillis());
        reason = newReason;
        assigner = newAssigner;
        student = newStudent;
        project = newProject;
    }

    /**
     *
     * @return {@link User}/ Admin that executed the assignment
     */
    public User getAssigner() {
        return assigner;
    }

    /**
     *
     * @return student that gets assigned
     */
    public Student getStudent() {
        return student;
    }

    /**
     *
     * @return project that the student is assigned to
     */
    public Project getProject() {
        return project;
    }

    /**
     *
     * @return whether assignment is a suggestion (if false this is a definitive assignment made by an admin)
     */
    public boolean isSuggestion() {
        return isSuggestion;
    }

    /**
     *
     * @return the creation timestamp of the assignment
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }

    /**
     *
     * @return the reason the student got assigned
     */
    public String getReason() {
        return reason;
    }

    /**
     *
     * @param newReason to assign this student to the project
     */
    public void setReason(final String newReason) {
        reason = newReason;
    }

    /**
     *
     * @param newSuggestion update whether this assignment is a suggestion of is definitive
     */
    public void setSuggestion(final boolean newSuggestion) {
        isSuggestion = newSuggestion;
    }
}
