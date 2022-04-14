package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.ProjectSkill;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.util.ArrayList;
import java.util.List;

/**
 * A DTO that helps to convert a ProjectSkill to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class ProjectSkillDTO {
    /**
     * The id of the skill.
     */
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
     * The Project that looks for this skill.
     */
    private String project;


    /**
     * The assignments made around this project.
     */
    private List<String> assignments = new ArrayList<>();

    public ProjectSkillDTO(final ProjectSkill skill, final EntityLinks entityLinks) {
        id = skill.getId();
        name = skill.getName();
        additionalInfo = skill.getAdditionalInfo();

        project = entityLinks.linkToItemResource(Project.class, skill.getProject().getId().toString()).getHref();

        assignments = new ArrayList<>();
        for (Assignment assignment: skill.getAssignments()) {
            assignments.add(entityLinks.linkToItemResource(Assignment.class, assignment.getId().toString()).getHref());
        }
    }
}
