package com.osoc6.OSOC6.webhook;

import com.osoc6.OSOC6.exception.WebhookException;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * A webhook field represents a single question from the tally form.
 */
@Data
public class FormField {

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
        throw new WebhookException(String.format("No option matching id '%s' found.", optionId));
    }

    /**
     * Get all the values from the chosen options, except for the 'Other' option.
     * To get all selected options, the value needs to be parsed as a list of strings.
     * @return a list containing all the chosen values
     */
    @SuppressWarnings("unchecked")
    public List<String> getAllNonOtherMatchingOptionValues() {
        List<String> chosenOptionIds;
        try {
            chosenOptionIds = (List<String>) value;
        } catch (ClassCastException e) {
            throw new WebhookException(String.format("Cannot parse '%s' as list of string.", value));
        }
        return options
                .stream()
                .filter((option ->
                        chosenOptionIds.contains(option.getId())
                                && !option.getText().equalsIgnoreCase("other")))
                .map((Option::getText))
                .toList();
    }

    /**
     * Get the url from the value. Used for getting the url from the FILE_UPLOAD field.
     * @return the url contained in the value
     */
    @SuppressWarnings("unchecked")
    public String getUrlFromValue() {
        try {
            Map<String, String> fileMap = ((List<Map<String, String>>) value).get(0);
            return fileMap.get("url");
        } catch (ClassCastException e) {
            throw new WebhookException(String.format("Cannot parse '%s' as a map of string, string.", value));
        }
    }
}
