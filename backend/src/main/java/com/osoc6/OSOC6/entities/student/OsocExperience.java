package com.osoc6.OSOC6.entities.student;

import com.osoc6.OSOC6.exception.WebhookException;
import lombok.Getter;

/**
 * This enum contains the different kinds of experience a student can have in OSOC.
 */
public enum OsocExperience {
    /**
     * Student has not participated in OSOC.
     */
    NONE("No, it's my first time participating in osoc", ""),

    /**
     * Student has participated in OSOC and doesn't want to be a student coach.
     */
    YES_NO_STUDENT_COACH("Yes, I have been part of osoc before", "No, I don't want to be a student coach"),

    /**
     * Student has not participated in and wishes to be a student coach.
     */
    YES_STUDENT_COACH("Yes, I have been part of osoc before", "Yes, I'd like to be a student coach");

    /**
     * Whether the student has participated in OSOC before or not.
     */
    @Getter
    private final String participation;

    /**
     * Whether the student would like to be a student coach or not.
     */
    @Getter
    private final String studentCoach;

    OsocExperience(final String newParticipation, final String newStudentCoach) {
        participation = newParticipation;
        studentCoach = newStudentCoach;
    }

    /**
     * Parse a participation string into an OsocExperience enum object.
     * @param participation the participation string to parse
     * @return the corresponding OsocExperience enum
     * @throws WebhookException if no matching OsocExperience was found
     */
    public static OsocExperience fromParticipation(final String participation) {
        for (OsocExperience osocExperience : OsocExperience.values()) {
            if (osocExperience.participation.equalsIgnoreCase(participation)) {
                return osocExperience;
            }
        }
        throw new WebhookException(
                String.format("No osocexperience participation matching '%s' found.", participation));
    }

    /**
     * Parse a student coach string into an OsocExperience enum object.
     * @param studentCoach the student coach string to parse
     * @return the corresponding OsocExperience enum
     * @throws WebhookException if no matching OsocExperience was found
     */
    public static OsocExperience fromStudentCoach(final String studentCoach) {
        for (OsocExperience osocExperience : OsocExperience.values()) {
            if (osocExperience.studentCoach.equalsIgnoreCase(studentCoach)) {
                return osocExperience;
            }
        }
        throw new WebhookException(String.format("No osocexperience studentcoach matching '%s' found.", studentCoach));
    }
}
