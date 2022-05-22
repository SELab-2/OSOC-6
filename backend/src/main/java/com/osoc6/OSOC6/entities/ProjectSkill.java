package com.osoc6.OSOC6.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
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
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String additionalInfo;

    /**
     * The Project that looks for this skill.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @JoinColumn(name = "project_id", referencedColumnName = "id")
    @Getter
    private Project project;

    /**
     * Assigned students to this skill.
     */
    @OneToMany(orphanRemoval = true, mappedBy = "projectSkill")
    @Getter
    private List<Assignment> assignments = new ArrayList<>();

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

    @Override @JsonIgnore
    public Edition getControllingEdition() {
        return project.getControllingEdition();
    }
}
