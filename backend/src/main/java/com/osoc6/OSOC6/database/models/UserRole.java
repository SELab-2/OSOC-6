package com.osoc6.OSOC6.database.models;

/**
 * This enum represents the different technical roles a user can have within the application.
 * An admin can also have the semantic role of coach but that is all embedded in the technical admin roll.
 */
public enum UserRole {
    /**
     * An OSOC-coach.
     */
    COACH,

    /**
     * An OSOC-admin.
     */
    ADMIN;
}
