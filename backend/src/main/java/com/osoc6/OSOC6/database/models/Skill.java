package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_name")})
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
     * The {@link SkillType} this Skill represents.
     */
    private SkillType skillType;

    /**
     * Edition within which this skill was created.
     */
    @ManyToOne(optional = false)
    private Edition edition;

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
     * @return edition this skill was created in
     */
    public Edition getEdition() {
        return edition;
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
