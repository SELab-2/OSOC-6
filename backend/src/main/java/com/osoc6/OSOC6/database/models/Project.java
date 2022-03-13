package com.osoc6.OSOC6.database.models;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
//TODO: @Table(indexes = {@Index(unique = false, name = "Project-Edition", columnList = "edition")})
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

    @ManyToOne(optional = false)
    private Edition edition;

    // TODO: Many to many
    /*
    @ManyToMany(mappedBy = "Project")
    private Set<Organisation> organisations;
     */

    @ManyToOne(optional = false)
    private User creator;

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
