package com.osoc6.OSOC6.database.models;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;

    public String getDescription() {
        return description;
    }

    public String getName() {
        return name;
    }
}
