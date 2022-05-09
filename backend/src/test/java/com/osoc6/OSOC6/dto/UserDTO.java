package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.entities.Communication;
import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.entities.Project;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.UserRole;
import com.osoc6.OSOC6.entities.UserSkill;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.util.ArrayList;
import java.util.List;

/**
 * A DTO that helps to convert a student to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class UserDTO {
    /**
     * The id of the user.
     */
    private Long id;

    /**
     * The email of the user.
     */
    private String email;

    /**
     * The password of the user.
     */
    private String password;

    /**
     * The call name of the user.
     */
    private String callName;

    /**
     * Role/ power this user has.
     */
    private UserRole userRole;

    /**
     * Indicates whether the account is locked. Needed to implement UserDetails.
     */
    private final boolean accountNonLocked = false;

    /**
     * Indicates whether the account is enabled. Needed to implement UserDetails.
     */
    private Boolean enabled = true;

    /**
     * {@link List} of {@link Invitation} that was sent out by the user.
     * A user can only create invitations if it has the {@link UserRole} admin.
     */
    private List<String> sendInvitations;

    /**
     * The {@link Invitation} that allowed the user to participate in an {@link com.osoc6.OSOC6.entities.Edition}.
     */
    private List<String> receivedInvitations;

    /**
     * List of communications this user initiated ordered on the timestamp of the {@link Communication}.
     */
    private List<String> communications;

    /**
     * Set of skills a user has.
     */
    private List<String> skills;

    /**
     * The projects this User Coaches.
     */
    private List<String> projects;

    public UserDTO(final UserEntity user, final EntityLinks entityLinks) {
        id = user.getId();
        email = user.getEmail();
        password = user.getPassword();
        callName = user.getCallName();
        userRole = user.getUserRole();
        enabled = user.isEnabled();

        sendInvitations = new ArrayList<>();
        for (Invitation invitation: user.getSendInvitations()) {
            sendInvitations.add(entityLinks.linkToItemResource(Invitation.class,
                    invitation.getId().toString()).getHref());
        }

        receivedInvitations = new ArrayList<>();
        for (Invitation invitation: user.getReceivedInvitations()) {
            receivedInvitations.add(entityLinks.linkToItemResource(Invitation.class,
                    invitation.getId().toString()).getHref());
        }

        communications = new ArrayList<>();
        for (Communication communication: user.getCommunications()) {
            communications.add(entityLinks.linkToItemResource(Communication.class,
                    communication.getId().toString()).getHref());
        }

        skills = new ArrayList<>();
        for (UserSkill skill: user.getSkills()) {
            skills.add(entityLinks.linkToItemResource(UserSkill.class, skill.getId().toString()).getHref());
        }

        projects = new ArrayList<>();
        for (Project project: user.getProjects()) {
            projects.add(entityLinks.linkToItemResource(Project.class, project.getId().toString()).getHref());
        }
    }
}
