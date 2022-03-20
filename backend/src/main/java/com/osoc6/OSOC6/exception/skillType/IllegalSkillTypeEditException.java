package com.osoc6.OSOC6.exception.skillType;

import com.osoc6.OSOC6.exception.IllegalEditException;

/**
 * Exception thrown when a final field of SkillType is edited.
 */
public class IllegalSkillTypeEditException extends IllegalEditException {

    /**
     * Constructor of {@link IllegalSkillTypeEditException}.
     * @param field the field that was being edited
     */
    public IllegalSkillTypeEditException(final String field) {
        super(field, "SkillType");
    }
}
