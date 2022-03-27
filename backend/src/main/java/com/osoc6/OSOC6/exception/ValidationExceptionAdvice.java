package com.osoc6.OSOC6.exception;

import org.hibernate.HibernateException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.validation.ConstraintViolationException;

/**
 * Advice used to handle all exceptions thrown by validating user input.
 */
@ControllerAdvice
public class ValidationExceptionAdvice {
    /**
     * Handle advise given when a constraint is broken.
     * @param ex the {@link ConstraintViolationException} triggering this advice
     * @return a description of what went wrong.
     */
    @ResponseBody
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String handleConstraintBroken(final ConstraintViolationException ex) {
        return ex.getMessage();
    }

    /**
     * Handle advise given when id's are overwritten.
     * @param ex the {@link HibernateException} triggering this advice
     * @return a description of what went wrong.
     */
    @ResponseBody
    @ExceptionHandler(HibernateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String handleWrongId(final HibernateException ex) {
        return ex.getMessage();
    }
}
