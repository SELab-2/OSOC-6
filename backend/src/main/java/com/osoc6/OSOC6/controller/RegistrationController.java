package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.dto.RegistrationDTO;
import com.osoc6.OSOC6.exception.InvalidInvitationTokenException;
import com.osoc6.OSOC6.service.RegistrationService;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

/**
 * This controller handles the mappings for the registration of a user.
 */
@RestController
@RequestMapping(path = "/" + DumbledorePathWizard.REGISTRATION_PATH)
@AllArgsConstructor
public class RegistrationController {
    /**
     * Service used for the registration of users.
     */
    private final RegistrationService registrationService;

    /**
     * Method used to handle the registration of a user.
     * @param token the invitation token
     * @param request contains the userinfo needed to register a user.
     * @throws InvalidInvitationTokenException when the invitation token used does not exist or is invalid
     */
    @PostMapping
    public void register(@RequestParam final String token, @Valid @RequestBody final RegistrationDTO request) {
        Optional<Invitation> optionalInvitation = registrationService.getInvitationFromToken(token);
        if (optionalInvitation.isPresent() && optionalInvitation.get().isValid()) {
            registrationService.register(request, optionalInvitation.get());
        } else {
            throw new InvalidInvitationTokenException();
        }
    }
}
