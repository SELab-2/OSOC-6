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
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

/**
 * The database entity for a skill looked for in a {@link Project}.
 * A {@link ProjectSkill} is a Skill specific for projects. It has a certain type, {@link SkillType}.
 */
@Entity
@NoArgsConstructor
public final class ProjectSkill implements WeakToEdition {
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
     * The Project that looks for this skill.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    private Project project;

    /**
     *
     * @param newName the name of the skill
     * @param newProject the Project that looks for this skill.
     * @param newAdditionalInfo additional info describing the skill looked for
     */
    public ProjectSkill(final String newName, final Project newProject, final String newAdditionalInfo) {
        super();
        name = newName;
        project = newProject;
        additionalInfo = newAdditionalInfo;
    }

    @Override
    public Edition getControllingEdition() {
        return project.getControllingEdition();
    }
}
