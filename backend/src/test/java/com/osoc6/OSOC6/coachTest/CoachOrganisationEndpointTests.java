package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Organisation} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachOrganisationEndpointTests
        extends TestFunctionProvider<Organisation, Long, OrganisationRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private OrganisationRepository repository;

    /**
     * First sample organisation that gets loaded before every test.
     */
    private final Organisation organisation = new Organisation();

    /**
     * The actual path organisations are served on, with '/' as prefix.
     */
    private static final String ORGANISATIONS_PATH = "/" + DumbledorePathWizard.ORGANISATIONS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Intel Inc.";

    /**
     * The string that will be set as info to the above organisation.
     */
    private static final String ORGANISATION_INFO = "Experience what's inside";

    public CoachOrganisationEndpointTests() {
        super(ORGANISATIONS_PATH, TEST_STRING);
    }

    /**
     * Returns the OrganisationRepository that's being used.
     * @return the OrganisationRepository
     */
    @Override
    public OrganisationRepository get_repository() {
        return repository;
    }

    /**
     *
     * @param entity entity whose id we would like to know
     * @return the id of the Organisation
     */
    @Override
    public Long get_id(final Organisation entity) {
        return entity.getId();
    }

    /**
     * Add two test organisations to the database.
     */
    @Override
    public void setUpRepository() {
        organisation.setName("Cynalco Medics");
        organisation.setInfo("Cynalco go go!");

        repository.save(organisation);
    }

    /**
     * Remove the two test organisations from the database.
     */
    @Override
    public void removeSetUpRepository() {
        if (repository.existsById(organisation.getId())) {
            repository.deleteById(organisation.getId());
        }
    }

    /**
     * Creates a new Organisation.
     * @return a new Organisation
     */
    @Override
    public Organisation create_entity() {
        return new Organisation(ORGANISATION_INFO, TEST_STRING, null);
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    @Transactional
    public void find_by_name_works() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();
        base_test_all_queried_assertions(
                ORGANISATIONS_PATH + "/search/findByName", "name", randomOrganisation.getName());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void post_new_organisation_fails() throws Exception {
        Organisation randomOrganisation = create_entity();
        perform_post(ORGANISATIONS_PATH, randomOrganisation).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void delete_organisation_fails() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();
        perform_delete_with_id(ORGANISATIONS_PATH, randomOrganisation.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_legal_entity_succeeds() throws Exception {
        base_getting_legal_entity_succeeds();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_organisation_fails() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();

        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);

        perform_patch(ORGANISATIONS_PATH + "/" + randomOrganisation.getId(), patchMap)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}

