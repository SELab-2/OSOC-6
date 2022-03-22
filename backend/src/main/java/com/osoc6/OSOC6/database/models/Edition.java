package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * The database entity for an Edition.
 * An Edition refers to the OSOC editions.
 */
@Entity
@NoArgsConstructor
public class Edition {
    /**
     * The name of the edition.
     */
    @Id
    @Getter @Setter
    private String name;

    /**
     * The year of the edition.
     */
    @Basic(optional = false)
    @Getter @Setter
    private int year;

    /**
     * Whether the edition is active.
     */
    @Basic(optional = false)
    @Getter @Setter
    private boolean active;

    /**
     *
     * @param newName the name of the OSOC-edition
     * @param newYear the year in which the edition takes place
     * @param newActive whether or not the edition is still active
     */
    public Edition(final String newName, final int newYear, final boolean newActive) {
        super();
        name = newName;
        year = newYear;
        active = newActive;
    }
}
