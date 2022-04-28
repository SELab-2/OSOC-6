package com.osoc6.OSOC6.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class handles exceptions related to the webhook form processing.
 */
@ControllerAdvice
public class WebhookExceptionAdvice {
    /**
     * Handle advice given when there is a problem with processing a form received from the tally webhook.
     * @param ex the {@link WebhookException} triggering this advice
     * @return a description of what went wrong.
     */
    @ResponseBody
    @ExceptionHandler(WebhookException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String handleWebhookException(final WebhookException ex) {
        return ex.getMessage();
    }
}
