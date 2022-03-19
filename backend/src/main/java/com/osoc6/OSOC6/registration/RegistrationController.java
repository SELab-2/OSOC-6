package com.osoc6.OSOC6.registration;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/registration")
@AllArgsConstructor
public class RegistrationController {
    /**
     * Service used for the registration of users.
     */
    private final RegistrationService registrationService;

    /**
     * Method used to handle the registrationrequest of a user.
     * @param request contains the userinfo needed to register a user.
     */
    @PostMapping
    public void register(@RequestBody final RegistrationRequest request) {
        registrationService.register(request);
    }
}
