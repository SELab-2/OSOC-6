package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Setter @Getter
    private String name;

    /**
     * The year of the edition.
     */
    @Basic(optional = false)
    @Setter @Getter
    private int year;

    /**
     * Whether the edition is active.
     */
    @Basic(optional = false)
    @Setter @Getter
    private boolean active;

}
