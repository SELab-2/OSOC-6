package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
public class SkillTypeEntity {

    /**
     * The type of skill.
     */
    @Id
    @Getter private SkillType skillType;

    /**
     * The colour associated with this SkillType.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.COLOUR_DESCRIPTION_LENGTH)
    @Getter @Setter private String colour;

    /**
     *
     * @param newSkillType the type of the skill
     * @param newColour the colour associated with this SkillType
     */
    public SkillTypeEntity(final SkillType newSkillType, final String newColour) {
        skillType = newSkillType;
        colour = newColour;
    }
}
