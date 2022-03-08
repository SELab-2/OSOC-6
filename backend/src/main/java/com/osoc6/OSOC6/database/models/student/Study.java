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
     *
     * @return the title of the study.
     */
    public String getTitle() {
        return studyCourse.getCourse(this);
    }
}
