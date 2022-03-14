package com.osoc6.OSOC6.database.models.student;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Study {
    /**
     * The id of the study.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The title of the study.
     */
    @Basic(optional = true)
    @Column(length = 100)
    private String course;

    /**
     * The course studied by the student.
     */
    @Basic(optional = false)
    private StudyCourse studyCourse;

    /**
     * Study's default no-arg constructor.
     */
    public Study() { }

    /**
     *
     * @param newCourse the title of the study
     */
    public Study(final String newCourse) {
        setCourseName(newCourse);
    }

    /**
     *
     * @return the title of the study.
     */
    public String getCourseName() {
        return studyCourse.getCourse(this);
    }

    /**
     *
     * @param newCourse string representation of the course that should be represented
     */
    public void setCourseName(final String newCourse) {
        studyCourse = StudyCourse.fromString(newCourse);
        if (studyCourse == StudyCourse.OTHER) {
            course = newCourse;
        } else {
            course = "";
        }
    }
}
