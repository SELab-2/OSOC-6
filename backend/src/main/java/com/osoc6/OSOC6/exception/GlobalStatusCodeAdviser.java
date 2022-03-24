package com.osoc6.OSOC6.exception;

import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Class that provides default messages for status codes.
 */
@ControllerAdvice
public class GlobalStatusCodeAdviser {
    /**
     * Function providing a default message for the not found status code.
     * @param ex {@link ResourceNotFoundException} that triggers the advice.
     * @return the message sent to the user.
     */
    @ResponseBody
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String handleNotFound(final ResourceNotFoundException ex) {
        if (ex.getMessage().isEmpty()) {
            return "Resource with provided identifiers was not found.";
        }
        return ex.getMessage();
    }
}
