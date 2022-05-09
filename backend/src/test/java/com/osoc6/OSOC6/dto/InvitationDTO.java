package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.entities.Edition;
import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.entities.UserEntity;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.sql.Timestamp;

/**
 * A DTO that helps to convert a Invitation to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class InvitationDTO {
    /**
     * The id of the invitation.
     */
    private Long id;

    /**
     * The unique token of the invitation.
     */
    private final String token;

    /**
     * The timestamp of the invitation.
     */
    private Timestamp creationTimestamp;

    /**
     * {@link Edition} for which this invitation was created.
     */
    private String edition;

    /**
     * User that issued the invitation.
     */
    private String issuer;

    /**
     * User that accepted the invitation.
     */
    private String subject;

    public InvitationDTO(final Invitation invitation, final EntityLinks entityLinks) {
        id = invitation.getId();
        token = invitation.getToken();
        creationTimestamp = invitation.getCreationTimestamp();

        edition = entityLinks.linkToItemResource(Edition.class, invitation.getEdition().getId().toString()).getHref();

        issuer = entityLinks.linkToItemResource(UserEntity.class, invitation.getIssuer().getId().toString()).getHref();

        subject = invitation.getSubject() == null ? null
            : entityLinks.linkToItemResource(UserEntity.class, invitation.getSubject().getId().toString()).getHref();
    }
}
