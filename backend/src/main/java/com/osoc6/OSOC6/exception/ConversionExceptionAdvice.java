package com.osoc6.OSOC6.exception;

import org.springframework.core.convert.ConversionFailedException;
import org.springframework.data.rest.webmvc.RepositoryRestExceptionHandler;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class makes it so that when an bad request is returned when conversion fails.
 * this will give a HTTP Bad Request.
 *
 * @author ruben
 */
@ControllerAdvice(basePackageClasses = RepositoryRestExceptionHandler.class)
public class ConversionExceptionAdvice {

    /**
     * Handle all conversion exceptions.
     * @param ex the thrown exception
     * @return a response entity with status code bad request
     */
    @ResponseBody
    @ExceptionHandler({NumberFormatException.class, ConversionFailedException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    String handle(final Exception ex) {
        return ex.getMessage();
    }
}
