package com.osoc6.OSOC6.exception;

/**
 * This error is thrown when a project is not found, but is requested.
 *
 * @author ruben
 */
public class ProjectNotFoundException extends RuntimeException{

    public ProjectNotFoundException(Long id) {
        super("Could not find project with id " + id);
    }

}
