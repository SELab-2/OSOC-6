package com.osoc6.OSOC6.exception.skillType;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class makes it so that when an EditionNotFoundException error is thrown
 * this will render a HTTP 403.
 *
 * @author jitsedesmet
 */
@ControllerAdvice
public class IllegalSkillTypeEditAdvice {

    /**
     * When a skillType is edited in a final field,
     * render a 403 not found and throw a {@link IllegalSkillTypeEditException}.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(IllegalSkillTypeEditException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    String editionNotFoundHandler(final IllegalSkillTypeEditException ex) {
        return ex.getMessage();
    }
}
