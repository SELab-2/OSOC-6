package com.osoc6.OSOC6.database.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@NoArgsConstructor
@AllArgsConstructor
public class SkillType {
    /**
     * The type of skill.
     */
    @Id
    @Column(length = RadagastNumberWizard.SMALL_DESCRIPTION_LENGTH)
    @Getter
    private String skillType;

    /**
     * The colour associated with this SkillType.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.COLOUR_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String colour;
}
