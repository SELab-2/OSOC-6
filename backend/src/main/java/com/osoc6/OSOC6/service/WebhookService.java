package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.exception.WebhookException;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.PublicRepository;
import com.osoc6.OSOC6.webhook.FormField;
import com.osoc6.OSOC6.webhook.WebhookForm;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * This service handles the processing of the webhook form.
 */
@Service
@AllArgsConstructor
public class WebhookService {
    /**
     * The edition repository, used to access editions from the database.
     */
    private final EditionRepository editionRepository;

    /**
     * The public repository, used to access the database without authorization.
     */
    private final PublicRepository publicRepository;

    /**
     * Process the webhook form by creating a new student and adding the form answer to them.
     * Afterwards, save the student to the database.
     * @param webhookForm the received form to process
     * @param editionName the name of the edition the student is applying for
     */
    public void processWebhookForm(final WebhookForm webhookForm, final String editionName) {
        Optional<Edition> optionalEdition = editionRepository.internalFindByName(editionName);
        if (optionalEdition.isPresent()) {
            Student student = new Student();
            List<FormField> fields = webhookForm.getData().getFields().stream()
                    .filter(formField -> formField.getKey() != null)
                    .toList();
            for (FormField formField : fields) {
                formField.addToStudent(student);
            }
            student.setEdition(optionalEdition.get());
            publicRepository.internalSave(student);
        } else {
            throw new WebhookException(String.format("Edition with name '%s' not found.", editionName));
        }
    }
}
