package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Edition {

    /**
     * The id of the edition.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The year of the edition.
     */
    private Date year;

    /**
     * Whether or not the edition is active.
     */
    private boolean active;

    /**
     * The name of the edition.
     */
    private String name;

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
    public Date getYear() {
        return year;
    }

    /**
     *
     * @return the id of the edition
     */
    public Long getId() {
        return id;
    }
}
