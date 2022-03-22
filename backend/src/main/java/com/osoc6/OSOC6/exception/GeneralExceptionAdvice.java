package com.osoc6.OSOC6.exception;

import org.springframework.data.rest.webmvc.RepositoryRestExceptionHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice(basePackageClasses = RepositoryRestExceptionHandler.class)
public class GeneralExceptionAdvice {

    /**
     * Handle all general exceptions.
     * @param ex the thrown exception
     * @return a response entity with status code bad request
     */
    @ExceptionHandler
    ResponseEntity handle(final Exception ex) {
        return new ResponseEntity("Something went wrong with your request", new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }
}
