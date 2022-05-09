package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.entities.CommunicationTemplate;
import com.osoc6.OSOC6.repository.CommunicationTemplateRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link CommunicationTemplate} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachCommunicationTemplateEndpointTests
        extends TestFunctionProvider<CommunicationTemplate, Long, CommunicationTemplateRepository> {

    /**
     * The repository which saves, searches, ... {@link CommunicationTemplate} in the database.
     */
    @Autowired
    private CommunicationTemplateRepository repository;

    /**
     * First sample communication template that gets loaded before every test.
     */
    private final CommunicationTemplate communicationTemplate = TestEntityProvider.getBaseCommunicationTemplate1(this);

    /**
     * The actual path communication templates are served on, with '/' as prefix.
     */
    private static final String COMMUNICATION_TEMPLATE_PATH = "/" + DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Dear sir, madam, I think I'm in love with you.";

    public CoachCommunicationTemplateEndpointTests() {
        super(COMMUNICATION_TEMPLATE_PATH, TEST_STRING);
    }


    @Override
    public Long get_id(final CommunicationTemplate entity) {
        return entity.getId();
    }

    @Override
    public CommunicationTemplateRepository get_repository() {
        return repository;
    }

    @Override
    public Map<String, String> change_entity(final CommunicationTemplate startEntity) {
        return Map.of("template", TEST_STRING);
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        repository.save(communicationTemplate);
    }

    @Override
    public void removeSetUpRepository() {
        removeBasicData();

        repository.deleteAll();
    }

    @Override
    public CommunicationTemplate create_entity() {
        CommunicationTemplate template = TestEntityProvider.getBaseCommunicationTemplate2(this);
        template.setTemplate(TEST_STRING);
        return template;
    }

    // ======================= Tests =======================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_name_fails() throws Exception {
        CommunicationTemplate template = get_random_repository_entity();
        getMockMvc().perform(get(COMMUNICATION_TEMPLATE_PATH + "/search/"
                        + DumbledorePathWizard.COMMUNICATION_TEMPLATE_BY_NAME_PATH)
                .queryParam("name", template.getName()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_communication_template_fails() throws Exception {
        CommunicationTemplate entity = create_entity();
        perform_post(COMMUNICATION_TEMPLATE_PATH, entity).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_communication_template_fails() throws Exception {
        CommunicationTemplate entity = get_random_repository_entity();
        perform_delete_with_id(COMMUNICATION_TEMPLATE_PATH, entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_entity_fails() throws Exception {
        CommunicationTemplate entity = get_random_repository_entity();
        perform_get(COMMUNICATION_TEMPLATE_PATH + "/" + entity.getId()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        CommunicationTemplate entity = get_random_repository_entity();

        perform_patch(COMMUNICATION_TEMPLATE_PATH + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

}
