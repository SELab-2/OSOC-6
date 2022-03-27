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
     * Transforms object to json string for a request and remove null id.
     * @param obj object which needs to be converted to JSON
     * @return JSON string which contains the object
     */
    public static String asJsonStringNoEmptyId(final Object obj) {
        String res = asJsonString(obj);
        return res.replace("\"id\":null,", "");
    }

    /**
     * Transforms object to json string for a request and removes needed fields.
     * @param obj object which needs to be converted to JSON
     * @param fields list of fields that need to be removed from the json object.
     * @return JSON string which contains the object
     */
    public static String asJsonStringExcludingFields(final Object obj, final String... fields) {
        String res = asJsonString(obj);
        for (String fieldName: fields) {
            res = res.replaceAll("\"" + fieldName + "\":[^,]*,", "");
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
