package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.database.models.CommunicationTemplate;
import com.osoc6.OSOC6.repository.CommunicationTemplateRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link CommunicationTemplate} with admin privileges.
 */
public final class AdminCommunicationTemplateEndpointTests extends
        AdminEndpointTest<CommunicationTemplate, Long, CommunicationTemplateRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private CommunicationTemplateRepository repository;

    /**
     * First sample edition that gets loaded before every test.
     */
    private final CommunicationTemplate communicationTemplate = TestEntityProvider.getBaseCommunicationTemplate1(this);

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String COMMUNICATION_TEMPLATE_PATH = "/" + DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Dear sir, madam, I think I'm in love with you.";

    public AdminCommunicationTemplateEndpointTests() {
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

    @Override
    public Map<String, String> change_entity(final CommunicationTemplate startEntity) {
        return Map.of("template", TEST_STRING);
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_name_works() throws Exception {
        CommunicationTemplate template = get_random_repository_entity();
        base_test_all_queried_assertions(
                COMMUNICATION_TEMPLATE_PATH + "/search/" + DumbledorePathWizard.COMMUNICATION_TEMPLATE_BY_NAME_PATH,
                "name", template.getName());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_name_no_query_works() throws Exception {
        perform_get(COMMUNICATION_TEMPLATE_PATH + "/search/"
                + DumbledorePathWizard.COMMUNICATION_TEMPLATE_BY_NAME_PATH)
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(communicationTemplate.getName()));
    }
}
