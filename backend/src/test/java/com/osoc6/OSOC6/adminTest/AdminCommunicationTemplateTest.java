package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.database.models.CommunicationTemplate;
import com.osoc6.OSOC6.repository.CommunicationTemplateRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link CommunicationTemplate} with admin privileges.
 */
public final class AdminCommunicationTemplateTest extends
        AdminEndpointTest<CommunicationTemplate, Long, CommunicationTemplateRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private CommunicationTemplateRepository repository;

    /**
     * First sample edition that gets loaded before every test.
     */
    private final CommunicationTemplate communicationTemplate = new CommunicationTemplate();

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String COMMUNICATION_TEMPLATE_PATH = "/" + DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Dear sir, madam, I think I'm in love with you.";

    public AdminCommunicationTemplateTest() {
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
        communicationTemplate.setName("A well deserved yes");
        communicationTemplate.setTemplate(
                "We would like to inform you... You are the best candidate we ever had! We want you! Need you!");
        repository.save(communicationTemplate);
    }

    @Override
    public void removeSetUpRepository() {
        if (repository.existsById(communicationTemplate.getId())) {
            repository.deleteById(communicationTemplate.getId());
        }
    }

    @Override
    public CommunicationTemplate create_entity() {
        return new CommunicationTemplate("Love Letter", TEST_STRING);
    }

    @Override
    public Map<String, String> change_entity(final CommunicationTemplate startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("template", TEST_STRING);
        return changeMap;
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void find_by_name_works() throws Exception {
        CommunicationTemplate template = get_random_repository_entity();
        base_test_all_queried_assertions(
                COMMUNICATION_TEMPLATE_PATH + "/search/findByName", "name", template.getName());
    }
}
