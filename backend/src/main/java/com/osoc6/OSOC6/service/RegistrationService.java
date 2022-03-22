package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.dto.RegistrationDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * This service handles the registration of a user.
 */
@Service
@AllArgsConstructor
public class RegistrationService {

    /**
     * Service used to load user-specific data.
     */
    private final UserEntityService userEntityService;

    /**
     * Handle user registration requests.
     * @param request contains the userinfo needed to register a user.
     */
    public void register(final RegistrationDTO request) {
        UserEntity registeredUser = new UserEntity(
                request.getEmail(),
                request.getCallName(),
                UserRole.COACH,
                request.getPassword()
        );
        userEntityService.registerUser(registeredUser);
    }

}
