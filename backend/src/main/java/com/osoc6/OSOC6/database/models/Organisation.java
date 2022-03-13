package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
     * Organisation's default no-arg constructor.
     */
    public Organisation() { }

    /**
     *
     * @param newInfo a string containing some info about the organisation
     * @param newName the name of the organisation
     */
    public Organisation(final String newInfo, final String newName) {
        this.info = newInfo;
        this.name = newName;
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
