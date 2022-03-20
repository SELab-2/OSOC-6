package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.dto.RegistrationDTO;
import com.osoc6.OSOC6.service.RegistrationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * This controller handles the mappings for the registration of a user.
 */
@RestController
@RequestMapping(path = "/registration")
@AllArgsConstructor
public class RegistrationController {
    /**
     * Service used for the registration of users.
     */
    private final RegistrationService registrationService;

    /**
     * Method used to handle the registration of a user.
     * @param request contains the userinfo needed to register a user.
     */
    @PostMapping
    public void register(@RequestBody final RegistrationDTO request) {
        registrationService.register(request);
    }
}
