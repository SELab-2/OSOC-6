package com.osoc6.OSOC6.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;


/**
 * The database entity for an Edition.
 * An Edition refers to the OSOC editions.
 */
@Entity
@NoArgsConstructor
public final class Edition {

    /**
     * The id of the edition.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    /**
     * The name of the edition.
     */
    @Basic(optional = false)
    @Column(unique = true)
    @Setter @Getter
    private String name;

    /**
     * The year of the edition.
     */
    @Basic(optional = false)
    @Setter @Getter
    private Integer year;

    /**
     * Whether the edition is active.
     */
    @Basic(optional = false)
    @Setter @Getter
    private Boolean active;

    /**
     *
     * @param newName the name of the edition
     * @param newYear the year of the edition
     * @param newActive whether the edition is active
     */
    public Edition(final String newName, final Integer newYear, final boolean newActive) {
        name = newName;
        year = newYear;
        active = newActive;
    }
}
