package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


/**
 * Class testing the integration of {@link Edition}.
 */
public class EditionEndpointTests extends EndpointTest<Edition, EditionRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private EditionRepository repository;

    /**
     * A new edition.
     */
    private final Edition newEdition = new Edition();

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

    public EditionEndpointTests() {
        super();
    }

    /**
     * Add two test editions to the database.
     */
    @BeforeEach
    public void setUp() {
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
    @AfterEach
    public void remove_test_editions() {
        if (repository.existsById(edition1.getId())) {
            repository.deleteById(edition1.getId());
        }
        if (repository.existsById(edition2.getId())) {
            repository.deleteById(edition2.getId());
        }
    }

    @Override
    public final Edition create_entity() {
        String editionName = "EDITION 2022";
        newEdition.setName(editionName);
        newEdition.setYear(1);
        newEdition.setActive(true);
        return newEdition;
    }

    @Override
    public final EditionRepository get_repository() {
        return repository;
    }

    @Override
    public final String get_path() {
        return EDITIONS_PATH;
    }

    @Override
    public final String get_teststring() {
        return "EDITION 2022";
    }

    @Override
    public final Long get_id(final Edition edition) {
        return edition.getId();
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void edition_toggle_active() throws Exception {
        List<Edition> editions = repository.findAll();
        Edition edition = editions.get(0);

        boolean prevActive  = edition.isActive();
        edition.setActive(!prevActive);

        perform_patch(EDITIONS_PATH + "/" + edition.getId(), edition);

        perform_get(EDITIONS_PATH + "/" + edition.getId())
                .andExpect(status().isOk())
                .andExpect(content().string(Util.containsFieldWithValue("active", !prevActive)));
    }

//    /**
//     * Check if the repository accepts new editions.
//     * @exception Exception throws exception if not there
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void add_new_edition() throws Exception {
//        String editionName = "EDITION 2022";
//        Edition newEdition = new Edition();
//        newEdition.setName(editionName);
//        newEdition.setYear(1);
//        newEdition.setActive(true);
//
//        repository.save(newEdition);
//
//        check_get(EDITIONS_PATH, editionName);
//    }
//
//    /**
//     * Check if we can add an edition via a POST request.
//     * @exception Exception throws exception if not there
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void post_new_edition() throws Exception {
//        Edition newEdition = new Edition();
//        String editionName = "POST EDITION";
//        newEdition.setName(editionName);
//        newEdition.setYear(1);
//        newEdition.setActive(true);
//
//        perform_post(EDITIONS_PATH, newEdition);
//        check_get(EDITIONS_PATH, editionName);
//
//    }
//
//    /**
//     * Check if we can delete an edition via a DELETE request.
//     * @exception Exception throws exception if not deleted
//     */
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void delete_edition() throws Exception {
//        List<Edition> editions = repository.findAll();
//        Edition edition = editions.get(0);
//
//        // Is the edition really in /editions
//        check_get(EDITIONS_PATH, edition.getName());
//
//        // Run the delete request
//        perform_delete_with_id(EDITIONS_PATH, edition.getId());
//
//        // Check if still there
//        if (repository.existsById(edition.getId())) {
//            throw new Exception();
//        }
//
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void delete_edition_throws_not_found() throws Exception {
//        List<Edition> editions = repository.findAll();
//        Edition edition = editions.get(0);
//
//        // Is the edition really in /editions
//        check_get(EDITIONS_PATH, edition.getName());
//
//        // Run the delete request
//        perform_delete_with_id(EDITIONS_PATH, edition.getId());
//
//        perform_delete_with_id(EDITIONS_PATH, edition.getId())
//                .andExpect(status().isNotFound())
//                .andExpect(string_not_empty());
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void getting_illegal_edition_fails() throws Exception {
//        perform_get(EDITIONS_PATH + "/" + ILLEGAL_ID)
//                .andExpect(status().isNotFound())
//                .andExpect(string_not_empty());
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void getting_illegal_edition_fails_name() throws Exception {
//        perform_get(EDITIONS_PATH + "/" + ILLEGAL_NAME)
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    @WithMockUser(username = "admin", roles = {"ADMIN"})
//    public void patching_illegal_edition_fails() throws Exception {
//        Edition edition = new Edition();
//        edition.setActive(true);
//        edition.setName(ILLEGAL_NAME);
//        edition.setYear(60000);
//
//        perform_patch(EDITIONS_PATH + "/" + ILLEGAL_ID, edition)
//                .andExpect(status().isNotFound())
//                .andExpect(string_not_empty());
//    }
}
