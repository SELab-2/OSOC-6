package com.osoc6.OSOC6.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class handles exceptions related to the registration process.
 */
@ControllerAdvice
public class RegistrationExceptionAdvice {
    /**
     * When a user tries to register with a taken email address.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(AccountTakenException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    String registrationExceptionHandler(final AccountTakenException ex) {
        return ex.getMessage();
    }

    /**
     * When a user tries to register with an invalid invitation token.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(InvalidInvitationTokenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    String invalidInvitationRegistrationExceptionHandler(final InvalidInvitationTokenException ex) {
        return ex.getMessage();
    }
}
