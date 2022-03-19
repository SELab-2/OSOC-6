package com.osoc6.OSOC6.exception.skillType;

import com.osoc6.OSOC6.exception.SomeEntityNotFoundException;

public class SkillTypeNotFoundException extends SomeEntityNotFoundException {
    public SkillTypeNotFoundException(String id) {
        super("SkillType", id);
    }
}
