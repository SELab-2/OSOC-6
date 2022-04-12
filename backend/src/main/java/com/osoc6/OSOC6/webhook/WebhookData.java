package com.osoc6.OSOC6.webhook;

import lombok.Data;

import java.util.List;

/**
 * Data class containing the metadata and user submitted data of the tally webhook.
 */
@Data
public class WebhookData {

    /**
     * Id of the response.
     */
    private String responseId;
    /**
     * Id of the submission.
     */
    private String submissionId;
    /**
     * Id of the respondent.
     */
    private String respondentId;
    /**
     * Id of the submitted form.
     */
    private String formId;
    /**
     * Name of the submitted form.
     */
    private String formName;
    /**
     * Creation time of the submission.
     */
    private String createdAt;
    /**
     * The fields of the actual form.
     */
    private List<WebhookField> fields;
}
