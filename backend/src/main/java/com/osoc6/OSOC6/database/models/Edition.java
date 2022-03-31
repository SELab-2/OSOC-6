package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;


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
    @Setter @Getter
    private String name;

    /**
     * The year of the edition.
     */
    @Basic(optional = false)
    @NotNull
    @Setter @Getter
    private Integer year;

    /**
     * Whether the edition is active.
     */
    @Basic(optional = false)
    @NotNull
    @Setter @Getter
    private Boolean active;

    /**
     * Constructor for Edition.
     * @param newName the name of the OSOC-edition
     * @param newYear the year in which the edition takes place
     * @param newActive whether or not the edition is still active
     */
    public Edition(final String newName, final int newYear, final boolean newActive) {
        name = newName;
        year = newYear;
        active = newActive;
    }

}
