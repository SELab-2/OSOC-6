package com.osoc6.OSOC6.exception;

public class SomeEntityNotFoundException extends RuntimeException {
    public SomeEntityNotFoundException(final String entityName, final String id) {
        super("Could not find " + entityName + " identified by " + id);
    }
}
