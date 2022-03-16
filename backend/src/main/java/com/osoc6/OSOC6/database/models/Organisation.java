package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
public class Organisation {

    /**
     * The id of the organisation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The info of the organisation.
     */
    private String info;

    /**
     * The name of the organisation.
     */
    private String name;

    /**
     * {@link Set} of projects this Organisation is involved in.
     */
    @ManyToMany
    private Set<Project> projects;

    /**
     * Organisation's default no-arg constructor.
     */
    public Organisation() { }

    /**
     *
     * @param newInfo the info about the organisation
     * @param newName the name of the organisation
     * @param newProjects the projects belonging to the organisation
     */
    public Organisation(final String newInfo, final String newName, final Set<Project> newProjects) {
        info = newInfo;
        name = newName;
        projects = newProjects;
    }

    /**
     *
     * @return The info of the organisation
     */
    public String getInfo() {
        return info;
    }

    /**
     *
     * @return The name of the organisation
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return set of projects this Organisation is involved in
     */
    public Set<Project> getProjects() {
        return projects;
    }

    /**
     *
     * @param newInfo some information about the organization
     */
    public void setInfo(final String newInfo) {
        info = newInfo;
    }

    /**
     *
     * @param newName name of the organization
     */
    public void setName(final String newName) {
        name = newName;
    }
}
