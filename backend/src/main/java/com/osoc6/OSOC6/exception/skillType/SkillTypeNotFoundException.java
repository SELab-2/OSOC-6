package com.osoc6.OSOC6.exception.skillType;

import com.osoc6.OSOC6.exception.SomeEntityNotFoundException;

/**
 * Exception thrown when a SkillType is looked for but not found.
 */
public class SkillTypeNotFoundException extends SomeEntityNotFoundException {
    /**
     * Constructor of the exception.
     * @param id the identifier of the SkillType that was not found
     */
    public SkillTypeNotFoundException(final String id) {
        super("skillType", id);
    }
}
