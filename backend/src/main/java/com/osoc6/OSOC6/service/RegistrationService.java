package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.dto.RegistrationDTO;
import com.osoc6.OSOC6.repository.InvitationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * This service handles the registration of a user.
 */
@Service
@AllArgsConstructor
public class RegistrationService {

    /**
     * The invitation repository, used to access invitations from the database.
     */
    private final InvitationRepository invitationRepository;

    /**
     * Service used to load user-specific data.
     */
    private final UserEntityService userEntityService;

    /**
     * Get the invitation corresponding to the given token.
     * @param token the token of an invitation
     * @return an invitation or Optional#empty if the token does not belong to an invitation.
     */
    public Optional<Invitation> getInvitationFromToken(final String token) {
        return invitationRepository.findByToken(token);
    }

    /**
     * Handle user registration requests.
     * @param request contains the userinfo needed to register a user.
     * @param invitation the invitation that was used to register
     */
    public void register(final RegistrationDTO request, final Invitation invitation) {
        UserEntity registeredUser = new UserEntity(
                request.getEmail(),
                request.getCallName(),
                UserRole.COACH,
                request.getPassword()
        );
        userEntityService.registerUserWithInvitation(registeredUser, invitation);
    }

}
