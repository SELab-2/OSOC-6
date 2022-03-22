package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The database entity for a project.
 * A project is something Students work on within an edition.
 * A project has coaches to help the students and is typically done for or with help of an {@link Organisation}.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_name")})
@NoArgsConstructor
public class Project {

    /**
     * The id of the project.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The goals of the project.
     */
    @ElementCollection
    @Getter
    private List<String> goals;

    /**
     * The name of the project.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String name;

    /**
     * A URI pointing to the version management of the project.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI versionManagement;

    /**
     * Edition within which this project was created.
     */
    @ManyToOne(optional = false)
    @Getter
    private Edition edition;

    /**
     * Set of organisation that are involved in this project.
     */
    @ManyToMany(mappedBy = "projects")
    @Getter
    private Set<Organisation> organisations;

    /**
     * The {@link UserEntity}/ admin that created the project.
     */
    @ManyToOne(optional = false)
    @Getter
    private UserEntity creator;

    /**
     * The skills needed in this project.
     */
    @OneToMany(orphanRemoval = true)
    @Getter
    private Set<Skill> neededSkills;

    /**
     * The Users that will coach this project.
     */
    @ManyToMany
    @Getter
    private List<UserEntity> coaches;

    /**
     *
     * @param newName the name of the project
     * @param newEdition the edition that the project is associated with
     * @param newOrganisations the organisation that the project belongs to
     * @param newCreator the creator of the project
     */
    public Project(final String newName, final Edition newEdition,
                   final Set<Organisation> newOrganisations, final UserEntity newCreator) {
        super();
        goals = new ArrayList<>();
        name = newName;
        edition = newEdition;
        organisations = newOrganisations;
        creator = newCreator;
        neededSkills = new HashSet<>();
        coaches = new ArrayList<>();
    }
}
