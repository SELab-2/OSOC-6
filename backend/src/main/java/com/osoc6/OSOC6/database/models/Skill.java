package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
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

/**
 * The database entity for a Skill.
 * A skill is something People have or that can be looked for in people. It has a certain type, {@link SkillType}.
 * A skill can have a small description.
 */
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
    @Getter @Setter
    private String name;

    /**
     * The description of the skill.
     */
    @Basic(optional = true)
    @Lob
    @Getter @Setter
    private String additionalInfo;

    /**
     *
     * @param newName the name of the skill
     * @param newAdditionalInfo the info about the skill
     */
    public Skill(final String newName, final String newAdditionalInfo) {
        super();
        name = newName;
        additionalInfo = newAdditionalInfo;
    }
}
