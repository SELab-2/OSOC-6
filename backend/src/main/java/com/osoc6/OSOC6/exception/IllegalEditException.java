package com.osoc6.OSOC6.exception;

public class IllegalEditException extends RuntimeException{
    public IllegalEditException(final String field, final String type) {
        super("Field " + field + "is not editable in " + type);
    }
}
