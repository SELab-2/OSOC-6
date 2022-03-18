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

    private final UserEntityService userEntityService;

    public String register(RegistrationRequest request) {
        // TODO : fix admin and coach
        EmailValidator validator = EmailValidator.getInstance();
        if (!validator.isValid(request.getEmail())) {
            throw new IllegalStateException("Entered email-address is not valid.");
        }

        UserEntity registeredUser = new UserEntity(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPassword(),
                UserRole.COACH
        );
        userEntityService.registerUser(registeredUser);
        return "it works";

//        UserEntity registeredUser = new UserEntity(
//                request.getFirstName(),
//                request.getLastName(),
//                request.getEmail(),
//                request.getPassword(),
//                UserRole.ADMIN
//        );
//        userEntityService.registerUser(registeredUser);
//
//        // TODO : return token?
//        return "";
    }

}
