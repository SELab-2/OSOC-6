package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Edition {
    /**
     * The name of the edition.
     */
    @Id
    private String name;

    /**
     * The year of the edition.
     */
    private int year;

    /**
     * Whether the edition is active.
     */
    private boolean active;

    /**
     * Edition's default no-arg constructor
     */
    public Edition() {}

    /**
     *
     * @param name the name of the OSOC-edition
     * @param year the year in which the edition takes place
     * @param active whether or not the edition is still active
     */
    public Edition(String name, int year, boolean active) {
        this.name = name;
        this.year = year;
        this.active = active;
    }

    /**
     *
     * @return whether or not the edition is active
     */
    public boolean isActive() {
        return active;
    }

    /**
     *
     * @return the name of the edition
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return the year of the edition
     */
    public int getYear() {
        return year;
    }

    /**
     *
     * @param newName name of the edition
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param newYear in which the edition was held
     */
    public void setYear(final int newYear) {
        year = newYear;
    }

    /**
     *
     * @param newActive whether the edition is currently active
     */
    public void setActive(final boolean newActive) {
        active = newActive;
    }
}
