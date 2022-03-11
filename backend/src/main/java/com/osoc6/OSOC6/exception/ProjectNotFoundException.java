package com.osoc6.OSOC6.exception;

/**
 * This error is thrown when a project is not found, but is requested.
 *
 * @author ruben
 */
public class ProjectNotFoundException extends RuntimeException {

    /**
     * Custom exception that is thrown when a project is not found.
     * @param id the id of the requested project (which is not found in this case)
     */
    public ProjectNotFoundException(final Long id) {
        super("Could not find project with id " + id);
    }

}
