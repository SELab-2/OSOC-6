package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matcher;

import static org.hamcrest.Matchers.containsString;

/**
 * Util is a class that offers some test utility functions.
 */
public final class Util {
    /**
     * Constructor of class. Does nothing.
     */
    private Util() { }

    /**
     * Remove the null id field from a JSON object.
     * @param json JSON object to remove null id field from
     * @return JSON string which contains the updated JSON object
     */
    public static String removeEmptyIdFromJson(final String json) {
        return json.replace("\"id\":null,", "");
    }

    /**
     * Remove the specified fields from the JSON object.
     * @param json JSON object to remove fields from
     * @param fields list of fields that need to be removed from the json object.
     * @return JSON string which contains the object
     */
    public static String removeFieldsFromJson(final String json, final String... fields) {
        String res = json;
        for (String fieldName: fields) {
            res = res.replaceAll("\"" + fieldName + "\":[^,]*,", "");
            res = res.replaceAll(",\"" + fieldName + "\":.*", "}");
        }
        return res;
    }

    /**
     * Transforms object to json string for a request.
     * @param obj object which needs to be converted to JSON
     * @return JSON string which contains the object
     */
    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper objMapper = new ObjectMapper();
            return objMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    /**
     * Get a matcher that checks whether a json object contains an entry of fieldName.
     * @param fieldName the field or keyName that is looked for
     * @param valueAsString the value as a literal string that is being looked for
     * @return a matcher that checks if a json object contains an entry
     */
    private static Matcher<String> containsFieldWithLiteral(final String fieldName, final String valueAsString) {
        return containsString("\"" + fieldName + "\" : " + valueAsString);
    }

    /**
     * Get a matcher that checks whether a json object contains an entry of fieldName.
     * @param fieldName the field or keyName that is looked for
     * @param booleanValue the value as a boolean
     * @return a matcher that checks if a json object contains an entry
     */
    public static Matcher<String> containsFieldWithValue(final String fieldName, final boolean booleanValue) {
        return containsFieldWithLiteral(fieldName, Boolean.toString(booleanValue));
    }

    /**
     * Get a matcher that checks whether a json object contains an entry of fieldName.
     * @param fieldName the field or keyName that is looked for
     * @param stringValue the value as a string
     * @return a matcher that checks if a json object contains an entry
     */
    public static Matcher<String> containsFieldWithValue(final String fieldName, final String stringValue) {
        return containsFieldWithLiteral(fieldName, "\"" + stringValue + "\"");
    }
}
