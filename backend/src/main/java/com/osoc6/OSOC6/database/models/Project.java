package com.osoc6.OSOC6.database.models;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotBlank;

@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_name")})
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
    private List<String> goals;

    /**
     * The name of the project.
     */
    @NotBlank(message = "Project name can not be empty")
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    private String name;

    /**
     * Edition within which this project was created.
     */
    @ManyToOne(optional = false)
    private Edition edition;

    /**
     * Set of organisation that are involved in this project.
     */
    @ManyToMany(mappedBy = "projects")
    private Set<Organisation> organisations;

    /**
     * The {@link User}/ admin that created the project.
     */
    @ManyToOne(optional = false)
    private User creator;

    /**
     * The skills needed in this project.
     */
    @OneToMany(orphanRemoval = true)
    private Set<Skill> neededSkills;

    /**
     * Project's default no-arg constructor.
     */
    public Project() { }

    /**
     *
     * @param newName the name of the project
     * @param newEdition the edition that the project is associated with
     * @param newOrganisations the organisation that the project belongs to
     * @param newCreator the creator of the project
     */
    public Project(final String newName, final Edition newEdition,
                   final Set<Organisation> newOrganisations, final User newCreator) {
        goals = new ArrayList<>();
        name = newName;
        edition = newEdition;
        organisations = newOrganisations;
        creator = newCreator;
        neededSkills = new HashSet<>();
    }

    /**
     *
     * @return The goals of the project
     */
    public List<String> getGoals() {
        return goals;
    }

    /**
     *
     * @return The name of the project
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return The id of the project
     */
    public Long getId() {
        return id;
    }

    /**
     *
     * @return the edition within which this Project was created.
     */
    public Edition getEdition() {
        return edition;
    }

    /**
     *
     * @return Set of organisation involved in this project
     */
    public Set<Organisation> getOrganisations() {
        return organisations;
    }

    /**
     *
     * @return The user that created this project
     */
    public User getCreator() {
        return creator;
    }

    /**
     *
     * @return the needed skills in this project.
     */
    public Set<Skill> getNeededSkills() {
        return neededSkills;
    }

    /**
     *
     * @param newName name of the project
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param newGoals The goals of the project
     */
    public void setGoals(final List<String> newGoals) {
        goals = newGoals;
    }
}
