package com.osoc6.OSOC6.exception;

public class UserNotFoundException extends RuntimeException {

    /**
     * Generate an exception saying the user with the specified id wasn't found.
     * @param id id of the searched for user.
     */
    public UserNotFoundException(final Long id) {
        super("Could not find user with id " + id);
    }
}
