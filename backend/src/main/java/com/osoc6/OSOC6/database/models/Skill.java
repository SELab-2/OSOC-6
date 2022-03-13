package com.osoc6.OSOC6.database.models;

import javax.persistence.*;

@Entity
@Table(indexes = {@Index(unique = false, name = "Skill-Edition", columnList = "edition")})
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

    @ManyToOne(optional = false)
    private Edition edition;

    @ManyToOne(optional = false)
    private SkillTypeEntity type;

    /**
     * The {@link SkillType} this Skill represents.
     */
    private SkillType skillType;

    /**
     * Skill's default no-arg constructor.
     */
    public Skill() { }

    /**
     *
     * @param newName the name of the skill
     * @param newAdditionalInfo the info about the skill
     */
    public Skill(final String newName, final String newAdditionalInfo) {
        setName(newName);
        additionalInfo = newAdditionalInfo;
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
     * @return SkillType the skill represents
     */
    public SkillType getSkillType() {
        return skillType;
    }

    /**
     *
     * @param newName name of the skill/ roll
     */
    public void setName(final String newName) {
        skillType = SkillType.fromString(newName);
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
