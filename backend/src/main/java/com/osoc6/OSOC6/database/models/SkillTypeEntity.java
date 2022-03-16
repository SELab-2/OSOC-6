package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class SkillTypeEntity {

    /**
     * The type of skill.
     */
    @Id
    private SkillType skillType;

    /**
     * The colour associated with this SkillType.
     */
    private String colour;

    /**
     * SkillTypeEntity's default no-arg constructor.
     */
    public SkillTypeEntity() { }

    /**
     *
     * @param newSkillType the type of the skill
     * @param newColour the colour associated with this SkillType
     */
    public SkillTypeEntity(final SkillType newSkillType, final String newColour) {
        skillType = newSkillType;
        colour = newColour;
    }

    /**
     *
     * @return the colour associated with this SkillType
     */
    public String getColour() {
        return colour;
    }

    /**
     *
     * @return the skillType enum that this entity represents
     */
    public SkillType getSkillType() {
        return skillType;
    }

    /**
     *
     * @param newColour colour that represents the skillType
     */
    public void setColour(final String newColour) {
        colour = newColour;
    }
}
