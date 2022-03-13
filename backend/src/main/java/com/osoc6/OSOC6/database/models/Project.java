package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ElementCollection;
import javax.persistence.Id;
import java.util.List;

@Entity
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
     * Project's default no-arg constructor.
     */
    public Project() { }

    /**
     *
     * @param newGoals a list containing the goals of the project
     * @param newName the name of the project
     */
    public Project(final List<String> newGoals, final String newName) {
        this.goals = newGoals;
        this.name = newName;
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
     * @param newName name of the project
     */
    public void setName(final String newName) {
        name = newName;
    }
}
