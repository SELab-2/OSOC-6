package com.osoc6.OSOC6.registration;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.service.UserEntityService;
import lombok.AllArgsConstructor;
import org.apache.commons.validator.routines.EmailValidator;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RegistrationService {

    /**
     * Service used to load user-specific data.
     */
    private final UserEntityService userEntityService;

    /**
     * Handle userregistration requests.
     * @param request contains the userinfo needed to register a user.
     */
    public void register(final RegistrationRequest request) {
        EmailValidator validator = EmailValidator.getInstance();
        if (!validator.isValid(request.getEmail())) {
            throw new IllegalStateException("Entered email-address is not valid.");
        }

        UserEntity registeredUser = new UserEntity(
                request.getEmail(),
                request.getFirstName(),
                request.getLastName(),
                UserRole.COACH,
                request.getPassword()
        );
        userEntityService.registerUser(registeredUser);
    }

}
