package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * The database entity for a SkillType.
 * A SkillType is the label a skill can have. Labels include for example 'other'.
 * A label has a color to visually distinguish them.
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class SkillType {
    /**
     * The type of skill.
     */
    @Id
    @Column(length = RadagastNumberWizard.SMALL_DESCRIPTION_LENGTH)
    // We need to specify this here because we explicitly expose the id.
    // Every field with the Spring-Id annotation is non-editable.
    @ReadOnlyProperty
    @Getter
    private String name;

    /**
     * The colour associated with this SkillType.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.COLOUR_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String colour;
}
