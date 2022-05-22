package com.osoc6.OSOC6.webhook;

import com.osoc6.OSOC6.entities.student.Student;
import lombok.Getter;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * This class is used to process forms received from the webhook.
 * It does this by using the ids of the questions defined in tally-ids.properties.
 * These question ids are linked to the enum values of {@link QuestionKey}.
 */
public class FormProcessor {

    /**
     * Spring will automatically fill this field when injecting this class.
     * This is because its name corresponds to the middle name of the properties in tally-ids.properties,
     * and because of the getFormProcessor bean in {@link com.osoc6.OSOC6.configuration.WebConfiguration}.
     */
    @Getter
    private final Map<String, String> ids = new HashMap<>();

    /**
     * A mapping from question ids to their corresponding {@link QuestionKey} enum.
     */
    private final Map<String, QuestionKey> questionKeyMap = new HashMap<>();

    /**
     * Initialise questionKeyMap.
     * The PostConstruct annotation ensures that this is done after the ids field has been filled.
     */
    @PostConstruct
    public void initQuestionKeyMap() {
        for (QuestionKey questionKey : QuestionKey.values()) {
            String questionName = questionKey.toString();
            questionKeyMap.put(ids.get(questionName), questionKey);
        }
    }

    /**
     * Process the given form.
     * First, filter out all ids that do not correspond to (used) questions.
     * Then use the corresponding {@link QuestionKey} to add the response to the student.
     * @param webhookForm the form to process
     * @param student the student to add the answers to
     */
    public void processFormToStudent(final WebhookForm webhookForm, final Student student) {
        List<FormField> fields = webhookForm.getData().getFields().stream()
                .filter(formField -> questionKeyMap.containsKey(formField.getKey()))
                .toList();
        for (FormField formField : fields) {
            addToStudent(formField, student);
        }
    }

    /**
     * Add the answer to the given form field to the given student.
     * @param formField the form field containing the answer to a question
     * @param student the student to add the answer to
     */
    public void addToStudent(final FormField formField, final Student student) {
        QuestionKey questionKey = questionKeyMap.get(formField.getKey());
        questionKey.addToStudent(formField, student);
    }
}
