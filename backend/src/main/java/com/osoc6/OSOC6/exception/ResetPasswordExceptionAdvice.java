package com.osoc6.OSOC6.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class handles exceptions related to the reset password process.
 */
@ControllerAdvice
public class ResetPasswordExceptionAdvice {
    /**
     * When a user tries to reset their password with an invalid reset password token.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(InvalidResetPasswordTokenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    String invalidResetPasswordTokenExceptionHandler(final InvalidResetPasswordTokenException ex) {
        return ex.getMessage();
    }
}
