package com.osoc6.OSOC6.webhook;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * An option is used when the user can select multiple possible answers to a question.
 */
@Data
@AllArgsConstructor
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
