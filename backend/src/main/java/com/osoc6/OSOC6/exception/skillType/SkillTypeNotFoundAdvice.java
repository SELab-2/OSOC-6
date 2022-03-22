package com.osoc6.OSOC6.exception.skillType;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class makes it so that when an {@link SkillTypeNotFoundException} error is thrown, this will render a HTTP 404.
 *
 * @author jitsedesmet
 */
@ControllerAdvice
public class SkillTypeNotFoundAdvice {

    /**
     * When a skillType is requested but not found,
     * render a 404 not found and throw a {@link SkillTypeNotFoundException}.
     * @param ex the thrown exception
     * @return exception message
     */
    @ResponseBody
    @ExceptionHandler(SkillTypeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    String editionNotFoundHandler(final SkillTypeNotFoundException ex) {
        return ex.getMessage();
    }
}
