package com.osoc6.OSOC6.webhook;

import lombok.Data;

/**
 * Data class containing the json received from the tally webhook.
 */
@Data
public class WebhookForm {

    /**
     * Id of the received event.
     */
    private String eventId;
    /**
     * Type of the received event (should be FORM_RESPONSE).
     */
    private String eventType;
    /**
     * Creation time of the event.
     */
    private String createdAt;
    /**
     * The data of the received event.
     */
    private WebhookData data;
}
