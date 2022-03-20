package com.osoc6.OSOC6.exception.edition;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class makes it so that when an EditionNotFoundException error is thrown
 * this will render a HTTP 404.
 *
 * @author ruben
 */
@ControllerAdvice
public class EditionNotFoundAdvice {

    /**
     * When an edition is requested but not found,
     * render a 404 not found and throw a {@link EditionNotFoundException}.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(EditionNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String editionNotFoundHandler(final EditionNotFoundException ex) {
        return ex.getMessage();
    }
}
