package com.osoc6.OSOC6.webhook;

import lombok.Data;

/**
 * An option is used when the user can select multiple possible answers to a question.
 */
@Data
public class Option {

    /**
     * Id of the option.
     */
    private String id;
    /**
     * Text value of the option.
     */
    private String text;
}
