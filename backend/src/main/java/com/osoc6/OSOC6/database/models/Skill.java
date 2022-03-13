package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
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
    private String additionalInfo;

    /**
     * Skill's default no-arg constructor.
     */
    public Skill() { }

    /**
     *
     * @param newName the name of the skill
     * @param newAdditionalInfo a string containing additional info about the project
     */
    public Skill(final String newName, final String newAdditionalInfo) {
        this.name = newName;
        this.additionalInfo = newAdditionalInfo;
    }

    /**
     *
     * @return The description of the skill
     */
    public String getAdditionalInfo() {
        return additionalInfo;
    }

    /**
     *
     * @return The name of the skill
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @param newName name of the skill/ roll
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param newAdditionalInfo additional info that can be provided. Mostly provided for skills needed in a project
     */
    public void setAdditionalInfo(final String newAdditionalInfo) {
        additionalInfo = newAdditionalInfo;
    }
}
