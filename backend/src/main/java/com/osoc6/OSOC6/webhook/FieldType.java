package com.osoc6.OSOC6.webhook;

/**
 * A field type represents the type of a question field.
 */
public enum FieldType {
    /**
     * A multiple choice question with one answer.
     */
    MULTIPLE_CHOICE,
    /**
     * A large text input question.
     */
    TEXTAREA,
    /**
     * A small text input question.
     */
    INPUT_TEXT,
    /**
     * A phone number field.
     */
    INPUT_PHONE_NUMBER,
    /**
     * An email field.
     */
    INPUT_EMAIL,
    /**
     * A file upload field.
     */
    FILE_UPLOAD,
    /**
     * An input link field.
     */
    INPUT_LINK,
    /**
     * A multiple choice question with multiple answers.
     */
    CHECKBOXES,
    /**
     * A number input field.
     */
    INPUT_NUMBER
}
