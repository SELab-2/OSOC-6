package com.osoc6.OSOC6.database.models.student;

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
    private String course;

    /**
     * The course studied by the student.
     */
    private StudyCourse studyCourse;

    /**
     * Study's default no-arg constructor.
     */
    public Study() { }

    /**
     *
     * @param newCourse the title of the study
     * @param newStudyCourse the course studied by the student
     */
    public Study(final String newCourse, final StudyCourse newStudyCourse) {
        this.course = newCourse;
        this.studyCourse = newStudyCourse;
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
