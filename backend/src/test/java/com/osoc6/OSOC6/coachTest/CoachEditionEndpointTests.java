package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.entities.Edition;
import com.osoc6.OSOC6.repository.EditionRepository;
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
 * Class testing the integration of {@link Edition} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachEditionEndpointTests extends TestFunctionProvider<Edition, Long, EditionRepository> {

    /**
     * The repository which saves, searches, ... {@link Edition} in the database.
     */
    @Autowired
    private EditionRepository editionRepository;

    /**
     * Edition that is not tracked. A coach is unable to see this.
     */
    private final Edition nonTrackedEdition = TestEntityProvider.getBaseActiveEdition(this);


    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String EDITIONS_PATH = "/" + DumbledorePathWizard.EDITIONS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "EDITION 2022";

    public CoachEditionEndpointTests() {
        super(EDITIONS_PATH, TEST_STRING);
    }


    @Override
    public void setUpRepository() {
        setupBasicData();

        editionRepository.save(nonTrackedEdition);
    }

    /**
     * Remove the two test editions from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();

        editionRepository.deleteAll();
    }

    @Override
    public Edition create_entity() {
        Edition postEdition = TestEntityProvider.getBaseActiveEdition(this);
        postEdition.setName(TEST_STRING);
        return postEdition;
    }

    @Override
    public Map<String, String> change_entity(final Edition edition) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public EditionRepository get_repository() {
        return editionRepository;
    }

    @Override
    public Long get_id(final Edition edition) {
        return edition.getId();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_my_edition_by_id_works() throws Exception {
        Edition edition = getBaseActiveUserEdition();
        check_get(getEntityPath() + "/" + edition.getId(), edition.getName());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_other_edition_by_id_fails() throws Exception {
        perform_get(getEntityPath() + "/" + nonTrackedEdition.getId()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_my_edition_by_name_works() throws Exception {
        Edition edition = getBaseActiveUserEdition();
        base_test_all_queried_assertions(
                getEntityPath() + "/search/" + DumbledorePathWizard.EDITIONS_BY_NAME_PATH, "name", edition.getName());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_other_edition_by_name_doesnt_contain_result() throws Exception {
        getMockMvc().perform(get(getEntityPath() + "/search/" + DumbledorePathWizard.EDITIONS_BY_NAME_PATH)
                        .queryParam("name", nonTrackedEdition.getName()))
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(nonTrackedEdition.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_contains_my_edition() throws Exception {
        Edition edition = getBaseActiveUserEdition();
        base_get_all_entities_succeeds().andExpect(string_to_contains_string(edition.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_does_not_contain_not_tracked() throws Exception {
        base_get_all_entities_succeeds().andExpect(string_not_to_contains_string(nonTrackedEdition.getName()));
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void posting_edition_fails() throws Exception {
        perform_post(getEntityPath(), create_entity()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_edition_fails() throws Exception {
        Edition edition = getBaseActiveUserEdition();
        perform_patch(getEntityPath() + "/" + edition.getId(), change_entity(edition))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void deleting_edition_fails() throws Exception {
        perform_delete_with_id(getEntityPath(), getBaseActiveUserEdition().getId()).andExpect(status().isForbidden());
    }
}
