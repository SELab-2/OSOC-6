package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.io.Serializable;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Abstract class to help with testing the integration of endpoints.
 * Class only test with admin access level.
 *
 * @param <T> the entity of the repository using this class
 * @param <I> the id type of the entity
 * @param <R> the repository linked to the entity
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public abstract class AdminEndpointTest<T, I extends Serializable, R extends JpaRepository<T, I>>
        extends TestFunctionProvider<T, I, R> {

    public AdminEndpointTest(final String path, final String newTestString) {
        super(path, newTestString);
    }

    /**
     * Illegal entity to check if repository only accepts its own entities.
     */
    private final Edition illegalEdition = new Edition();

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void add_new() throws Exception {
        T entity = create_entity();

        save_repository_entity(entity);

        check_get(getEntityPath(), getTestString());

        delete_repository_entity(entity);
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_entity_succeeds() throws Exception {
        base_getting_legal_entity_succeeds();
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new() throws Exception {
        T entity = create_entity();

        perform_post(getEntityPath(), entity);
        check_get(getEntityPath(), getTestString());
        delete_repository_entity(entity);
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_illegal_entity() throws Exception {
        // Errors for entities where name is the id and name is empty
        System.out.println(Util.asJsonString(illegalEdition));
        getMockMvc().perform(post(getEntityPath())
                .content(Util.asJsonString(illegalEdition))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void posting_empty_object_is_user_error() throws Exception {
        getMockMvc().perform(post(getEntityPath())
                        .content("{ }")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_new() throws Exception {
        T newEntity = create_entity();
        perform_post(getEntityPath(), newEntity);

        T entity = get_random_repository_entity();

        // Is the entity really in /entity
        check_get(getEntityPath(), getTestString());

        // Run the delete request
        perform_delete_with_id(getEntityPath(), get_id(entity));

        // Check if still there
        if (repository_entity_exists(entity)) {
            throw new Exception();
        }
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_entity_throws_not_found() throws Exception {
        T newEntity = create_entity();
        perform_post(getEntityPath(), newEntity);

        T entity = get_random_repository_entity();

        // Is the edition really in /editions
        check_get(getEntityPath(), getTestString());

        // Run the delete request
        perform_delete_with_id(getEntityPath(), get_id(entity));

        perform_delete_with_id(getEntityPath(), get_id(entity))
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patch_changes_value() throws  Exception {
        T entity = get_random_repository_entity();

        Map<String, String> patchMap = change_entity(entity);

        perform_patch(this.getEntityPath() + "/" + get_id(entity), patchMap)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(getTestString()));
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}
