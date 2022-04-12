package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.webhook.WebhookForm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

/**
 * This controller is the webhook used to automatically process tally forms.
 */
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class WebhookController {

    /**
     * The edition repository, used to access invitations from the database.
     */
    private final EditionRepository editionRepository;

    /**
     * Method used to receive the data sent from the tally form.
     * @param token the secret token
     * @param edition the name of the edition
     * @param webhookForm the data itself
     */
    @PostMapping("/{token}")
    @PreAuthorize("#token == @spelUtil.webhookToken")
    public void postHook(@PathVariable("token") final String token, @RequestParam("edition") final String edition,
                         @RequestBody final WebhookForm webhookForm) {
        Optional<Edition> optionalEdition = editionRepository.internalFindByName(edition);
        if (optionalEdition.isPresent()) {
            // TODO de student aanmaken en invullen met de ontvangen data
            System.out.println("juiste editie!");
        } else {
            // TODO not found error smijten
            //  (of mischien de repository methode geen optional doen en die zelf een error laten smijten)
            throw new RuntimeException("Foute editie");
        }
    }
}
