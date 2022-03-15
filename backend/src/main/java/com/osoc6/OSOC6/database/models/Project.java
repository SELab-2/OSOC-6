package com.osoc6.OSOC6.database.models;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.List;
import java.util.Set;

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
     * Project's default no-arg constructor.
     */
    public Project() { }

    /**
     *
     * @param newGoals the goals of the project
     * @param newName the name of the project
     * @param newEdition the edition that the project is associated with
     * @param newOrganisations the organisation that the project belongs to
     * @param newCreator the creator of the project
     */
    public Project(final List<String> newGoals, final String newName, final Edition newEdition,
                   final Set<Organisation> newOrganisations, final User newCreator) {
        this.goals = newGoals;
        this.name = newName;
        this.edition = newEdition;
        this.organisations = newOrganisations;
        this.creator = newCreator;
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
     * @param newName name of the project
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param goal that needs to be added to the goals
     */
    public void addGoal(final String goal) {
        goals.add(goal);
    }
}
