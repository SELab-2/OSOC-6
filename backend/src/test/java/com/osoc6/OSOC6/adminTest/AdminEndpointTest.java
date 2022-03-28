package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.BaseTestPerformer;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;

import java.io.Serializable;
import java.util.List;

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
        extends BaseTestPerformer<T, I, R> {

    /**
     * An illegal id for edition.
     */
    private static final long ILLEGAL_ID = 0L;

    /**
     * An illegal string id.
     */
    private static final String ILLEGAL_NAME = "Some very illegal name";

    /**
     * The actual path the entity is served on, with '/' as prefix.
     */
    private final String entityPath;

    /**
     * The string used to test whether an entity can be found in the return value.
     */
    private final String testString;

    /**
     * Illegal entity to check if repository only accepts its own entities.
     */
    private final Edition illegalEdition = new Edition();

    public AdminEndpointTest(final String path, final String newTestString) {
        entityPath = path;
        testString = newTestString;
    }

    /**
     * Create a new entity to use as test object.
     * @return Entity of class T
     */
    public abstract T create_entity();

    /**
     * Change the entity to have a different field value.
     * This will be used to test whether a patch request works.
     * @param startEntity the entity we would like to change
     * @return an entity with a new value for a field
     */
    public abstract T change_entity(T startEntity);

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void add_new() throws Exception {
        T entity = create_entity();

        get_repository().save(entity);

        check_get(entityPath, testString);

        get_repository().delete(entity);
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void getting_illegal_entity_fails() throws Exception {
        perform_get(entityPath + "/" + ILLEGAL_ID)
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void getting_illegal_entity_fails_name() throws Exception {
        perform_get(entityPath + "/" + ILLEGAL_NAME)
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void post_new() throws Exception {
        T entity = create_entity();

        perform_post(entityPath, entity);
        check_get(entityPath, testString);
        get_repository().delete(entity);
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void post_illegal_entity() throws Exception {
        // Errors for entities where name is the id and name is empty
        System.out.println(Util.asJsonStringNoEmptyId(illegalEdition));
        getMockMvc().perform(post(entityPath)
                        .content(Util.asJsonStringNoEmptyId(illegalEdition))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void posting_empty_object_is_user_error() throws Exception {
        getMockMvc().perform(post(entityPath)
                        .content("{ }")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void delete_new() throws Exception {
        T newEntity = create_entity();
        perform_post(entityPath, newEntity);

        List<T> entities = get_repository().findAll();
        T entity = entities.get(0);

        // Is the entity really in /entity
        check_get(entityPath, testString);

        // Run the delete request
        perform_delete_with_id(entityPath, get_id(entity));

        // Check if still there
        if (get_repository().existsById(get_id(entity))) {
            throw new Exception();
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void delete_entity_throws_not_found() throws Exception {
        T newEntity = create_entity();
        perform_post(entityPath, newEntity);

        List<T> entities = get_repository().findAll();
        T entity = entities.get(0);

        // Is the edition really in /editions
        check_get(entityPath, testString);

        // Run the delete request
        perform_delete_with_id(entityPath, get_id(entity));

        perform_delete_with_id(entityPath, get_id(entity))
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patch_changes_value() throws  Exception {
        List<T> entities = get_repository().findAll();
        T entity = entities.get(0);

        T newEntity = change_entity(entity);

        perform_patch(entityPath + "/" + get_id(entity), newEntity)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testString));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patching_illegal_entity_fails() throws Exception {
        T entity = create_entity();

        perform_patch(entityPath + "/" + ILLEGAL_ID, entity)
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patch_changes_with_null_id_gives_409() throws Exception {
        List<T> entities = get_repository().findAll();
        T entity = entities.get(0);

        T newEntity = change_entity(entity);

        perform_patch_with_nullable_id(entityPath + "/" + get_id(entity), newEntity)
                .andExpect(status().isConflict());
    }
}
