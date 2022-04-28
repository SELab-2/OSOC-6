package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.ProjectSkill;
import com.osoc6.OSOC6.database.models.UserEntity;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.util.ArrayList;
import java.util.List;

/**
 * A DTO that helps to convert a Project to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class ProjectDTO {
    /**
     * The id of the project.
     */
    private Long id;

    /**
     * The goals of the project.
     */
    private List<String> goals;

    /**
     * The name of the project.
     */
    private String name;

    /**
     * Info about the project.
     */
    private String info;

    /**
     * A URI pointing to the version management of the project.
     */
    private String versionManagement;

    /**
     * Edition within which this project was created.
     */
    private String edition;

    /**
     * The name of the partner behind the project.
     */
    private String partnerName;

    /**
     * A URI pointing to the website of the partner.
     */
    private String partnerWebsite;

    /**
     * The {@link UserEntity}/ admin that created the project.
     */
    private String creator;

    /**
     * The skills needed in this project.
     */
    private List<String> neededSkills;

    /**
     * The Users that will coach this project.
     */
    private List<String> coaches;

    public ProjectDTO(final Project project, final EntityLinks entityLinks) {
        id = project.getId();
        goals = project.getGoals();
        name = project.getName();
        info = project.getInfo();
        versionManagement = project.getVersionManagement();
        partnerName = project.getPartnerName();
        partnerWebsite = project.getPartnerWebsite();

        edition = entityLinks.linkToItemResource(Edition.class, project.getEdition().getId().toString()).getHref();

        neededSkills = new ArrayList<>();
        for (ProjectSkill skill: project.getNeededSkills()) {
            neededSkills.add(entityLinks.linkToItemResource(ProjectSkill.class,
                    skill.getId().toString()).getHref());
        }

        creator = entityLinks.linkToItemResource(UserEntity.class, project.getCreator().getId().toString()).getHref();

        coaches = new ArrayList<>();
        for (UserEntity coach: project.getCoaches()) {
            coaches.add(entityLinks.linkToItemResource(UserEntity.class,
                    coach.getId().toString()).getHref());
        }
    }

}
