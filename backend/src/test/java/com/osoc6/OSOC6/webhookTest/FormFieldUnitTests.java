package com.osoc6.OSOC6.webhookTest;

import com.osoc6.OSOC6.exception.WebhookException;
import com.osoc6.OSOC6.webhook.FormField;
import com.osoc6.OSOC6.webhook.Option;
import com.osoc6.OSOC6.webhook.QuestionKey;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Unit tests for testing the auxiliary methods of the {@link com.osoc6.OSOC6.webhook.FormField} class.
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class FormFieldUnitTests {

    @Test
    public void get_matching_option_value_with_valid_option_id_works() {
        String optionText = "some text";
        String optionId = "1";

        FormField formField = new FormField();
        formField.setValue(optionId);
        formField.setOptions(List.of(
                new Option(optionId, optionText),
                new Option("2", "other text")
        ));

        assertEquals(optionText, formField.getMatchingOptionValue());
    }

    @Test
    public void get_matching_option_value_with_no_matching_option_id_throws_exception() {
        String optionId = "789";

        FormField formField = new FormField();
        formField.setValue(optionId);
        formField.setOptions(List.of(
                new Option("1", "some option text"),
                new Option("2", "other text")
        ));

        assertThrows(WebhookException.class, formField::getMatchingOptionValue);
    }

    @Test
    public void get_all_non_other_matching_option_values_with_list_value_works() {
        String optionText1 = "some option text";
        String optionText2 = "other text";
        List<String> optionTexts = List.of(optionText1, optionText2);
        List<String> optionIds = List.of("1", "2");

        FormField formField = new FormField();
        formField.setValue(optionIds);
        formField.setOptions(List.of(
                new Option("1", optionText1),
                new Option("2", optionText2),
                new Option("3", "Other")
        ));

        assertIterableEquals(optionTexts, formField.getAllNonOtherMatchingOptionValues());
    }

    @Test
    public void get_all_non_other_matching_option_values_with_list_value_does_not_contain_other() {
        String optionText1 = "some option text";
        String optionText2 = "other text";
        List<String> optionTexts = List.of(optionText1, optionText2);
        List<String> optionIds = List.of("1", "2", "3");

        FormField formField = new FormField();
        formField.setValue(optionIds);
        formField.setOptions(List.of(
                new Option("1", optionText1),
                new Option("2", optionText2),
                new Option("3", "Other")
        ));

        assertIterableEquals(optionTexts, formField.getAllNonOtherMatchingOptionValues());
    }

    @Test
    public void get_all_non_other_matching_option_values_with_wrong_typed_value_throws_exception() {
        String optionIds = "12";

        FormField formField = new FormField();
        formField.setValue(optionIds);
        formField.setOptions(List.of(
                new Option("1", "some option text"),
                new Option("2", "other text"),
                new Option("3", "Other")
        ));

        assertThrows(WebhookException.class, formField::getAllNonOtherMatchingOptionValues);
    }

    @Test
    public void get_url_from_value_with_list_of_map_value_works() {
        String url = "https://test.com";
        List<Map<String, String>> listMap = List.of(Map.of(
                "name", "testname",
                "url", url));
        FormField formField = new FormField();
        formField.setValue(listMap);

        assertEquals(url, formField.getUrlFromValue());
    }

    @Test
    public void get_url_from_value_with_wrong_typed_value_throws_exception() {
        String url = "https://test.com";
        FormField formField = new FormField();
        formField.setKey(QuestionKey.UPLOAD_PORTFOLIO);
        formField.setValue(url);

        assertThrows(WebhookException.class, formField::getUrlFromValue);
    }
}
