package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Assignment {
    /**
     * The id of the Assignment.
     */
    @Id
    @GeneratedValue
    private Long id;

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
}
