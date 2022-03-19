package com.osoc6.OSOC6.exception.skillType;

import com.osoc6.OSOC6.exception.IllegalEditException;

public class IllegalSkillTypeEditException extends IllegalEditException {
    public IllegalSkillTypeEditException(String field) {
        super(field, "SkillType");
    }
}
