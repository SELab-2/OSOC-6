package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ElementCollection;
import javax.persistence.Id;
import java.util.List;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
    @NotBlank(message = "Project name can not be empty")
    private String name;

    /**
     *
     * @return The goals of the project
     */
    @NotNull(message = "Goals can be an empty list, but not null")
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
