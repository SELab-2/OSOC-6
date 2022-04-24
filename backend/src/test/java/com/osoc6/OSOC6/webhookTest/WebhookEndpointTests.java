package com.osoc6.OSOC6.webhookTest;

import com.osoc6.OSOC6.BaseTestPerformer;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.IOException;
import java.io.InputStream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of the webhook.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class WebhookEndpointTests extends BaseTestPerformer<Student, Long, StudentRepository> {

    /**
     * The actual path used for receiving forms, with '/' as prefix.
     */
    private static final String WEBHOOK_PATH = "/" + DumbledorePathWizard.WEBHOOK_PATH;

    /**
     * This field is populated by Spring upon startup with the secret webhook token from the properties file.
     */
    @Value("${webhook.token}")
    private String token;

    /**
     * Indicates whether the test json files have been loaded.
     */
    private static boolean filesLoaded = false;

    /**
     * Resource of the first json form test file, loaded automatically upon startup.
     */
    @Value("classpath:testdata/form1.json")
    private Resource form1Resource;

    /**
     * Resource of the second json form test file, loaded automatically upon startup.
     */
    @Value("classpath:testdata/form2.json")
    private Resource form2Resource;

    /**
     * Json string of the first test form.
     */
    private static String jsonForm1;

    /**
     * Json string of the second test form.
     */
    private static String jsonForm2;

    /**
     * Load the json string of both test forms. This only happens the first time this method is called.
     * @throws IOException when there is a problem reading one of the test files
     * @apiNote We can't use the more fitting beforeAll annotation here because it requires the method to be static. So
     * that's why we use the filesLoaded flag to make sure the test forms are only loaded once.
     */
    @BeforeEach
    private void loadJsonForms() throws IOException {
        if (!filesLoaded) {
            InputStream inputStream1 = form1Resource.getInputStream();
            jsonForm1 = new String(inputStream1.readAllBytes());

            InputStream inputStream2 = form2Resource.getInputStream();
            jsonForm2 = new String(inputStream2.readAllBytes());

            filesLoaded = true;
        }
    }

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public final Long get_id(final Student entity) {
        return entity.getId();
    }

    @Override
    public final StudentRepository get_repository() {
        return studentRepository;
    }

    /**
     * Load test entities in the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();
    }

    /**
     * Remove the test entities from the database.
     */
    @Override
    public void removeSetUpRepository() {
        studentRepository.deleteAll();

        removeBasicData();
    }

    @Test
    public void submit_form1_with_valid_token_and_valid_edition_works() throws Exception {
        getMockMvc().perform(MockMvcRequestBuilders.post(WEBHOOK_PATH)
                        .queryParam("edition", getBaseActiveUserEdition().getName())
                        .queryParam("token", token)
                        .content(jsonForm1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Student createdStudent = get_random_repository_entity();

        assertEquals("Hawk", createdStudent.getFirstName());
        assertEquals("Eye", createdStudent.getLastName());
        assertEquals(getBaseActiveUserEdition().getId(), createdStudent.getEdition().getId());
    }

    @Test
    public void submit_form2_with_valid_token_and_valid_edition_works() throws Exception {
        getMockMvc().perform(MockMvcRequestBuilders.post(WEBHOOK_PATH)
                        .queryParam("edition", getBaseActiveUserEdition().getName())
                        .queryParam("token", token)
                        .content(jsonForm2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Student createdStudent = get_random_repository_entity();

        assertEquals("Waldo", createdStudent.getFirstName());
        assertEquals("Lance", createdStudent.getLastName());
        assertEquals(getBaseActiveUserEdition().getId(), createdStudent.getEdition().getId());
    }

    @Test
    public void submit_form_with_invalid_token_is_forbidden() throws Exception {
        getMockMvc().perform(MockMvcRequestBuilders.post(WEBHOOK_PATH)
                        .queryParam("edition", getBaseActiveUserEdition().getName())
                        .queryParam("token", "wrongtoken")
                .content(jsonForm1)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void submit_form_with_valid_token_and_invalid_edition_throws_exception() throws Exception {
        getMockMvc().perform(MockMvcRequestBuilders.post(WEBHOOK_PATH)
                        .queryParam("edition", "wrong edition")
                        .queryParam("token", token)
                        .content(jsonForm1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
