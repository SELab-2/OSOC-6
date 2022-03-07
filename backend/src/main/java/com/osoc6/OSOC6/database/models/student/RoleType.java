package com.osoc6.OSOC6.database.models.student;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class RoleType {
    /**
     * The name of the RoleType.
     */
    @Id
    private String name;

    /**
     * The colour associated with this RoleType.
     */
    private String colour;

    /**
     *
     * @return the colour associated with this RoleType
     */
    public String getColour() {
        return colour;
    }

    /**
     *
     * @return the name of the RoleType
     */
    public String getName() {
        return name;
    }
}
