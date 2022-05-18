package com.osoc6.OSOC6.entities;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;

/**
 * The database entity for a SkillType.
 * A SkillType is the label a skill can have. Labels include for example 'other'.
 * A label has a color to visually distinguish them.
 */
@Entity
@NoArgsConstructor
public final class SkillType {
    /**
     * The id of the SkillType.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    /**
     * The type of skill.
     */
    @NaturalId
    @Column(columnDefinition = "text") @ReadOnlyProperty
    @NotNull @Getter
    private String name;

    /**
     * The colour associated with this SkillType.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.COLOUR_DESCRIPTION_LENGTH)
    @Getter @Setter
    private String colour = "FFFFFF";

    /**
     * Constructor of {@link SkillType} for required final fields.
     * @param newName The name of the {@link SkillType}
     * @param newColour the colour associated with this {@link SkillType}
     */
    public SkillType(final String newName, final String newColour) {
        name = newName;
        colour = newColour;
    }
}
