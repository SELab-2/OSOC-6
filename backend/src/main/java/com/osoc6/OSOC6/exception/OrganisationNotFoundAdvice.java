package com.osoc6.OSOC6.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class makes it so that when an OrganisationNotFoundException error is thrown
 * this will render a HTTP 404.
 *
 * @author ruben
 */
@ControllerAdvice
class OrganisationNotFoundAdvice {

    /**
     * When a organisation is requested but not found,
     * render a 404 not found and throw a OrganisationNotFoundException.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(OrganisationNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String organisationNotFoundAdvice(final OrganisationNotFoundException ex) {
        return ex.getMessage();
    }
}
