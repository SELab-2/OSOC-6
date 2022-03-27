package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Edition;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Abstract class to help with testing the integration of endpoints.
 *
 * @param <T> the entity of the repository using this class
 * @param <R> the repository linked to the entity
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public abstract class EndpointTest<T, R extends JpaRepository<T, Long>> {
    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

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

    public EndpointTest(final String path, final String newTestString) {
        entityPath = path;
        testString = newTestString;
    }

    /**
     * Get the mockMVC.
     * @return the MockMVC
     */
    public MockMvc getMockMvc() {
        return mockMvc;
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

    /**
     * Get the repository connected to entity T.
     * @return a repository from entity T
     */
    public abstract R get_repository();

    /**
     * Get the id from an entity, this can be used for multiple purposes.
     * @param entity entity whose id we would like to know
     * @return the id of the entity
     */
    public abstract Long get_id(T entity);

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
        mockMvc.perform(post(entityPath)
                .content(Util.asJsonStringNoEmptyId(illegalEdition))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void posting_empty_object_is_user_error() throws Exception {
        mockMvc.perform(post(entityPath)
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

    /**
     * Perform a POST request.
     *
     * @param path   The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to post
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_post(final String path, final T entity) throws Exception {
        return mockMvc.perform(post(path)
                .content(Util.asJsonStringNoEmptyId(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a GET request.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_get(final String path) throws Exception {
        return mockMvc.perform(get(path));
    }

    /**
     * Perform a GET request that checks whether the entity is in the database.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @param check result matchers used to perform checks on the request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions check_get(final String path, final String check) throws Exception {
        return perform_get(path)
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(check));
    }

    /**
     * Perform a DELETE request.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @param id       the id of the entity we want to remove
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_delete_with_id(final String path, final Long id) throws Exception {
        return mockMvc.perform(delete(path + "/" + id));
    }

    /**
     * Perform a Patch request.
     * An id with value null will be removed to avoid exceptions.
     *
     * @param path   The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to post
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch(final String path, final T entity) throws Exception {
        return mockMvc.perform(patch(path).content(Util.asJsonStringNoEmptyId(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a Patch request.
     * An id with value null will not be removed it's up to you to handle this.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to post
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch_with_nullable_id(final String path, final T entity) throws Exception {
        String test = Util.asJsonString(entity);
        return mockMvc.perform(patch(path).content(Util.asJsonString(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * performs a patch on a single field on the provided path.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param field the field that must be patched.
     * @param jsonValue the patch value in json format. This means that when the value is a string you should add "".
     * @return a {@link ResultActions} that can be used for additional checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_field_patch(
            final String path, final String field, final String jsonValue) throws Exception {
        return mockMvc.perform(patch(path).content("{\"" + field + "\":" + jsonValue + "}")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Convert a {@link String} to a {@link ResultMatcher} that checks whether the string is contained in the result.
     *
     * @param str the string we want to look for
     * @return a result matcher that can be used to perform checks
     */
    public ResultMatcher string_to_contains_string(final String str) {
        return content().string(containsString(str));
    }

    /**
     * Get a {@link ResultMatcher} that checks whether the result is empty.
     *
     * @return a result matcher that can be used to perform checks
     */
    public ResultMatcher string_not_empty() {
        return content().string(not(emptyString()));
    }

}
