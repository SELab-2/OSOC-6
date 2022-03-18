package com.osoc6.OSOC6.exception;

/**
 * This error is thrown when an edition is not found, but is requested.
 *
 * @author ruben
 */
public class EditionNotFoundException extends RuntimeException {

    /**
     * Custom exception that is thrown when a edition is not found.
     * @param id the id of the requested edition (which is not found in this case)
     */
    public EditionNotFoundException(final String id) {
        super("Could not find edition with name " + id);
    }
}
