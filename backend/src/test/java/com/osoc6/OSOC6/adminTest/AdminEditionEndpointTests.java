package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Class testing the integration of {@link Edition}.
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
    private final Edition edition1 = new Edition();

    /**
     * Second sample edition that gets loaded before every test.
     */
    private final Edition edition2 = new Edition();

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
        loadUser();

        edition1.setName("Edition 1");
        edition1.setYear(0);
        edition1.setActive(false);
        repository.save(edition1);

        edition2.setName("Edition 2");
        edition2.setYear(1);
        edition2.setActive(true);
        repository.save(edition2);
    }

    /**
     * Remove the two test editions from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeUser();

        repository.deleteAll();
    }

    @Override
    public final Edition create_entity() {
        Edition postEdition = new Edition();
        postEdition.setName(TEST_STRING);
        postEdition.setYear(1);
        postEdition.setActive(true);
        return postEdition;
    }

    @Override
    public final Map<String, String> change_entity(final Edition edition) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);
        return patchMap;
    }

    @Override
    public final EditionRepository get_repository() {
        return repository;
    }

    @Override
    public final Long get_id(final Edition edition) {
        return edition.getId();
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void edition_toggle_active() throws Exception {
        List<Edition> editions = repository.findAll();
        Edition edition = editions.get(0);

        boolean prevActive  = edition.getActive();
        edition.setActive(!prevActive);

        perform_put(EDITIONS_PATH + "/" + edition.getId(), edition);

        perform_get(EDITIONS_PATH + "/" + edition.getId())
                .andExpect(status().isOk())
                .andExpect(content().string(Util.containsFieldWithValue("active", !prevActive)));
    }
}
