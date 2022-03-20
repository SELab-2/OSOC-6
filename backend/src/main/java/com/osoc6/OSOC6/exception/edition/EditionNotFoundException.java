package com.osoc6.OSOC6.exception.edition;

import com.osoc6.OSOC6.exception.SomeEntityNotFoundException;

/**
 * This error is thrown when an edition is not found, but is requested.
 *
 * @author ruben
 */
public class EditionNotFoundException extends SomeEntityNotFoundException {

    /**
     * Custom exception that is thrown when a edition is not found.
     * @param id the id of the requested edition (which is not found in this case)
     */
    public EditionNotFoundException(final String id) {
        super("edition", id);
    }
}
