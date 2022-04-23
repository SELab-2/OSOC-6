package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.service.WebhookService;
import com.osoc6.OSOC6.webhook.WebhookForm;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * This controller is the webhook used to automatically process tally forms.
 */
@RestController
@RequestMapping("/webhook")
@AllArgsConstructor
public class WebhookController {

    /**
     * Service used for processing the webhook form.
     */
    private final WebhookService webhookService;

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
        webhookService.processWebhookForm(webhookForm, edition);
    }
}
