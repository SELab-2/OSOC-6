package com.osoc6.OSOC6.exception;

/**
 * This error is thrown when a organisation is not found, but is requested.
 *
 * @author ruben
 */
public class OrganisationNotFoundException extends RuntimeException {

    /**
     * Custom exception that is thrown when a organisation is not found.
     * @param id the id of the requested organisation (which is not found in this case)
     */
    public OrganisationNotFoundException(final Long id) {
        super("Could not find organisation with id " + id);
    }

}
