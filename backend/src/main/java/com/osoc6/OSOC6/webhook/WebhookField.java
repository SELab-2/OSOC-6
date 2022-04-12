package com.osoc6.OSOC6.webhook;

import com.osoc6.OSOC6.exception.WebhookException;
import lombok.Data;

import java.util.List;
import java.util.Objects;

/**
 * A webhook field represents a single question from the tally form.
 */
@Data
public class WebhookField {

    /**
     * The unique identifying key of the question.
     */
    private QuestionKey key;
    /**
     * The actual question.
     */
    private String label;
    /**
     * The field type of the question.
     */
    private FieldType type;
    /**
     * The answer(s) to the question.
     */
    private Object value;
    /**
     * The options of the question.
     */
    private List<Option> options;

    /**
     * Given an id and a list of options, get option from the list with the same id.
     * @return the value of the matched option
     * @throws WebhookException if there is no matching option
     */
    public String getMatchingOptionValue() {
        String optionId = (String) value;
        for (Option option : options) {
            if (optionId.equals(option.getId())) {
                return option.getText();
            }
        }
        throw new WebhookException(String.format("No option matching id %s found.", optionId));
    }

    /**
     * Get all the values from the chosen options, except for the 'Other' option.
     * @return a list containing all the chosen values
     */
    public List<String> getAllNonOtherMatchingOptionValues() {
        // TODO probeer met objectmapper
        //  (https://stackoverflow.com/questions/44589381/how-to-convert-json-string-into-list-of-java-object)
//      ObjectMapper mapper = new ObjectMapper();
        List<String> chosenOptionIds = (List<String>) value;
        return options
                .stream()
                .filter((option ->
                        chosenOptionIds.contains(option.getId()) && !Objects.equals(option.getText(), "Other")))
                .map((Option::getText))
                .toList();
    }
}
