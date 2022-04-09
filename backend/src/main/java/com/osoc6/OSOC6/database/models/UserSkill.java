package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * The database entity for a skill of a {@link UserEntity}.
 * A UserSkill is a Skill specific for Users. It has a certain type, {@link SkillType}.
 */
@Entity
@NoArgsConstructor
public final class UserSkill {
    /**
     * The id of the skill.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    /**
     * The name of the skill.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH)
    @Getter
    @Setter
    private String name;

    /**
     * The description of the skill.
     */
    @Basic(optional = true)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String additionalInfo;

    /**
     * The Project that looks for this skill.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @JoinColumn(name = "user_entity_id", referencedColumnName = "id")
    @Getter
    private UserEntity userEntity;

    /**
     *
     * @param newName the name of the skill
     * @param newUserEntity the user that has this skill
     * @param newAdditionalInfo additional info provided by the user about this skill
     */
    public UserSkill(final String newName, final UserEntity newUserEntity, final String newAdditionalInfo) {
        super();
        name = newName;
        userEntity = newUserEntity;
        additionalInfo = newAdditionalInfo;
    }
}
