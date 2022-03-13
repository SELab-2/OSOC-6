package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Assignment {
    @Id
    @GeneratedValue
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @ManyToOne(optional = false)
    private User assigner;

    @ManyToOne(optional = false)
    private Student student;

    @ManyToOne(optional = false)
    private Project project;
}
