package com.osoc6.OSOC6.database.models.student;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Role {

    /**
     * The id of the role.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The title of the role.
     */
    private String title;
    //private RoleType roleType

    /**
     *
     * @return the id of the role
     */
    public Long getId() {
        return id;
    }

    /**
     *
     * @return the title of the role
     */
    public String getTitle() {
        return title;
    }
}
