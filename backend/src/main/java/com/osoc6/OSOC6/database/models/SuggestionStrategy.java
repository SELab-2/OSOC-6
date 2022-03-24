package com.osoc6.OSOC6.database.models;

/**
 * Different methods to make a suggestion about a user.
 */
public enum SuggestionStrategy {
    /**
     * Suggesting Yes: I want this student.
     */
    YES,
    /**
     * Suggesting Maybe: yes, you are a good student, but I doubt there is a project for you.
     */
    MAYBE,
    /**
     * Suggesting No: student is not qualified.
     */
    NO;
}
