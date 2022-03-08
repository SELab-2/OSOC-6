package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SkillTypeEntity {
    /**
     * The type of skill.
     */
    @Id
    private SkillType type;

    /**
     * The colour associated with this SkillType.
     */
    private String colour;

    /**
     *
     * @return the colour associated with this SkillType
     */
    public String getColour() {
        return colour;
    }

    /**
     * @param skill the skill this entity is used in.
     * @return the name of the SkillType
     */
    public String getSkillName(final Skill skill) {
        return type.getSkillName(skill);
    }
}
