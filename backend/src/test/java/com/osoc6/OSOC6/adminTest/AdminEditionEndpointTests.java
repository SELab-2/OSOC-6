package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Class testing the integration of {@link Edition} as an admin.
 */
public class AdminEditionEndpointTests extends AdminEndpointTest<Edition, Long, EditionRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private EditionRepository repository;

    /**
     * First sample edition that gets loaded before every test.
     */
    private final Edition edition1 = TestEntityProvider.getBaseNonActiveEdition(this);

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String EDITIONS_PATH = "/" + DumbledorePathWizard.EDITIONS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "EDITION 2022";

    public AdminEditionEndpointTests() {
        super(EDITIONS_PATH, TEST_STRING);
    }

    /**
     * Add two test editions to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        repository.save(edition1);
    }

    /**
     * Remove the two test editions from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();

        repository.deleteAll();
    }

    @Override
    public final Edition create_entity() {
        Edition postEdition = TestEntityProvider.getBaseActiveEdition(this);
        postEdition.setName(TEST_STRING);
        return postEdition;
    }

    @Override
    public final Map<String, String> change_entity(final Edition edition) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public final EditionRepository get_repository() {
        return repository;
    }

    @Override
    public final Long get_id(final Edition edition) {
        return edition.getId();
    }

    /**
     * Get a "random" repository entity. Since there is also a basic test edition in the database because of the
     * {@link com.osoc6.OSOC6.BaseTestPerformer}, we need to manually make sure we get a different edition.
     * @return a "random" edition
     */
    @Override
    public Edition get_random_repository_entity() {
        AtomicReference<Edition> entity = new AtomicReference<>();
        performAsAdmin(() -> entity.set(get_repository().getById(edition1.getId())));
        return entity.get();
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void edition_toggle_active() throws Exception {
        Edition edition = get_random_repository_entity();

        Map<String, String> changeMap = new HashMap<>();
        boolean prevActive  = edition.getActive();
        changeMap.put("active", Boolean.toString(!prevActive));

        perform_patch(EDITIONS_PATH + "/" + edition.getId(), changeMap);

        perform_get(EDITIONS_PATH + "/" + edition.getId())
                .andExpect(status().isOk())
                .andExpect(content().string(Util.containsFieldWithValue("active", !prevActive)));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void edition_needs_unique_name() throws Exception {
        post_new();

        perform_patch(getEntityPath() + "/" + edition1.getId(), Map.of("name", TEST_STRING))
                .andExpect(status().isConflict());
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_my_edition_by_name_works() throws Exception {
        Edition edition = getBaseUserEdition();
        base_test_all_queried_assertions(getEntityPath() + "/search/" + DumbledorePathWizard.EDITIONS_BY_NAME_PATH,
                "name", edition.getName());
    }
}
