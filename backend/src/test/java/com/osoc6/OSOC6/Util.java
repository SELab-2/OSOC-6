package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.Matcher;

import static org.hamcrest.Matchers.containsString;

public class Util {
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

    private static Matcher<String> containsFieldWithLiteral(String fieldName, String valueAsString) {
        return containsString("\"" + fieldName + "\":" + valueAsString);
    }
    public static Matcher<String> containsFieldWithValue(String fieldName, boolean booleanValue) {
        return containsFieldWithLiteral(fieldName, Boolean.toString(booleanValue));
    }
    public static Matcher<String> containsFieldWithValue(String fieldName, String stringValue) {
        return containsFieldWithLiteral(fieldName, "\"" + stringValue + "\"");
    }
}
