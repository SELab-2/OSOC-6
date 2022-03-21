package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Basic;


/**
 * The database entity for an Edition.
 * An Edition refers to the OSOC editions.
 */
@Entity
@NoArgsConstructor
public class Edition {

    /**
     * The id of the edition.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    /**
     * The name of the edition.
     */
    @Basic(optional = false)
    private String name;

    /**
     * The year of the edition.
     */
    @Basic(optional = false)
    private int year;

    /**
     * Whether the edition is active.
     */
    @Basic(optional = false)
    private boolean active;

    /**
     *
     * @return whether or not the edition is active
     */
    public boolean getActive() {
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
