package com.osoc6.OSOC6.database.models.student;

public enum OsocExperience {
    /**
     * Student has not participated in OSOC.
     */
    NONE,

    /**
     * Student has participated in OSOC and doesn't want to be a student coach.
     */
    YES_NO_STUDENT_COACH,

    /**
     * Student has not participated in and wishes to be a student coach.
     */
    YES_STUDENT_COACH;
}
