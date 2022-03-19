package com.osoc6.OSOC6.dto;

import lombok.Data;

@Data
public class SkillTypeDTO {
    /**
     * The type of skill.
     */
    private String name;

    /**
     * The colour associated with this SkillType.
     */
    private String colour;
}
