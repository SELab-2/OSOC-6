package com.osoc6.OSOC6.exception;

/**
 * An abstract class that has a basic construction for an exception thrown when a final field is edited.
 */
public abstract class IllegalEditException extends RuntimeException {
    /**
     *
     * @param field The field that is being edited and should not
     * @param entity the entity that is being edited.
     */
    public IllegalEditException(final String field, final String entity) {
        super("Field " + field + " is not editable in " + entity + ".");
    }
}
