package com.osoc6.OSOC6.database.models;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    /**
     * An OSOC-coach.
     */
    COACH,

    /**
     * An OSOC-admin.
     */
    ADMIN,

    /**
     * A disabled user.
     */
    DISABLED;

    /**
     * Transform a json string to a UserRole, if the json string represents a valid UserRole, otherwise retuns null.
     * @param json the json string to convert to a UserRole
     * @return a UserRole or null
     */
    @JsonCreator
    public static UserRole fromJson(final String json) {
        try {
            return UserRole.valueOf(json);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
