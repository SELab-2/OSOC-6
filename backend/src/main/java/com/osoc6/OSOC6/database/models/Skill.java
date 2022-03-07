package com.osoc6.OSOC6.database.models;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class Skill {

    /**
     * The id of the skill.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The name of the skill.
     */
    private String name;

    /**
     * The description of the skill.
     */
    private String description;

    /**
     *
     * @return The id of the skill
     */
    public Long getId() {
        return id;
    }

    /**
     *
     * @return The description of the skill
     */
    public String getDescription() {
        return description;
    }

    /**
     *
     * @return The name of the skill
     */
    public String getName() {
        return name;
    }
}
