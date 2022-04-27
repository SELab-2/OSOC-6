package com.osoc6.OSOC6.exception;

/**
 * This exception is thrown when there is a problem while parsing the data from the tally webhook.
 */
public class WebhookException extends RuntimeException {

    /**
     * Constructor for WebhookException.
     * @param message contains a detailed error message
     */
    public WebhookException(final String message) {
        super(message);
    }
}
