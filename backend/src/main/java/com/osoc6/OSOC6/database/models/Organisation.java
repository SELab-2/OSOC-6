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
}
