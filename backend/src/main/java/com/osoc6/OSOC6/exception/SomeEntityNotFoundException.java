package com.osoc6.OSOC6.exception;

/**
 * An abstract class that has a basic construction for an exception thrown when an entity is not found.
 */
public abstract class SomeEntityNotFoundException extends RuntimeException {
    /**
     * Constructor of the exception.
     * @param entityName the name of the entity that was not found, should be provided by classes extending this.
     * @param id the identifier of the field that was not found.
     */
    public SomeEntityNotFoundException(final String entityName, final String id) {
        super("Could not find " + entityName + " identified by " + id + ".");
    }
}
