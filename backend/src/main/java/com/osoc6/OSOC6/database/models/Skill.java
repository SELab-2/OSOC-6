package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
@NoArgsConstructor
public class Skill {

    /**
     * The id of the skill.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The name of the skill.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter private String name;

    /**
     * The description of the skill.
     */
    @Basic(optional = true)
    @Lob
    @Getter @Setter private String additionalInfo;

    /**
     * The {@link SkillType} this Skill represents.
     */
    @Basic(optional = false)
    @Getter private SkillType skillType;

    /**
     *
     * @param newName the name of the skill
     * @param newAdditionalInfo the info about the skill
     */
    public Skill(final String newName, final String newAdditionalInfo) {
        setName(newName);
        additionalInfo = newAdditionalInfo;
    }

    /**
     *
     * @param newName name of the skill/ roll
     */
    public void setName(final String newName) {
        skillType = SkillType.fromString(newName);
        name = newName;
    }
}
