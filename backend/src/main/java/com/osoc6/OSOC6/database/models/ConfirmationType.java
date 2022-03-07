package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ConfirmationType {

    /**
     * The name of the ConfirmationtType.
     */
    @Id
    private String name;

    /**
     * The template of the ConfirmationType.
     */
    private String template;

    /**
     *
     * @return the name of the ConfirmationType
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return the template of the ConfirmationType
     */
    public String getTemplate() {
        return template;
    }
}
