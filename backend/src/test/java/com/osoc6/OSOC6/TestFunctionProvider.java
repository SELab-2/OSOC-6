package com.osoc6.OSOC6;

import lombok.Getter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.test.web.servlet.ResultActions;

import java.io.Serializable;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Abstract class to help with testing the integration of endpoints.
 * Implements basic tests. These tests need to be wrapped in a Test annotated function by the user.
 * If a test is needed for a lot of entities, put it here so the code is not duplicated.
 *
 * @param <T> the entity of the repository using this class
 * @param <I> the id type of the entity
 * @param <R> the repository linked to the entity
 */
public abstract class TestFunctionProvider<T, I extends Serializable, R extends JpaRepository<T, I>>
        extends BaseTestPerformer<T, I, R> {
    /**
     * An illegal Long id.
     */
    @Getter
    private static final long ILLEGAL_ID = 0L;

    /**
     * An illegal string id.
     */
    private static final String ILLEGAL_NAME = "Some very illegal name";

    /**
     * The actual path the entity is served on, with '/' as prefix.
     */
    @Getter
    private final String entityPath;

    /**
     * The string used to test whether an entity can be found in the return value.
     */
    @Getter
    private final String testString;

    /**
     * Create a new entity to use as test object.
     * @return Entity of class T
     */
    public abstract T create_entity();

    /**
     * Change the entity to have a different field value.
     * This will be used to test whether a patch request works.
     * @param startEntity the entity we would like to change
     * @return an map containing names of fields and new values
     */
    public abstract Map<String, String> change_entity(T startEntity);

    public TestFunctionProvider(final String path, final String newTestString) {
        entityPath = path;
        testString = newTestString;
    }

    /**
     * Tests if a queried get request returns the searched element and no elements if a garbage search is performed.
     *
     * @param path the path the entity is served on, with '/' as prefix
     * @param paramName the parameter name that needs to be provided to the query.
     * @param value the value that will be searched for.
     * @throws Exception throws exception if the request fails
     */
    public void base_test_all_queried_assertions(final String path, final String paramName, final String value)
            throws Exception {
        perform_queried_get(path, new String[]{paramName}, new String[]{value})
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(value)));

        perform_queried_get(path, new String[]{paramName}, new String[]{"Banana" + value + "Apple"})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(value));
    }

    /**
     * Test if all entities can be found.
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request fails
     */
    public ResultActions base_get_all_entities_succeeds() throws Exception {
        return perform_get(entityPath)
                .andExpect(status().isOk());
    }

    /**
     * Tests if a random entity in the database can be found with GET.
     * @throws Exception throws exception if the request fails
     */
    public ResultActions base_getting_legal_entity_succeeds() throws Exception {
        T entity = get_random_repository_entity();
        return perform_get(entityPath + "/" + get_id(entity))
                .andExpect(status().isOk());
    }

    /**
     * Tests if a GET on a path with a non-existing Long id returns a not found.
     * @throws Exception throws exception if the request fails
     */
    public void base_getting_illegal_entity_fails() throws Exception {
        perform_get(entityPath + "/" + ILLEGAL_ID)
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    /**
     * Tests if a GET on a path with a wrong path (String id where Long is expected) fails.
     * @throws Exception throws exception if the request fails
     */
    public void base_getting_illegal_entity_fails_name() throws Exception {
        perform_get(entityPath + "/" + ILLEGAL_NAME)
                .andExpect(status().isBadRequest());
    }

    /**
     * Tests if a PATCH on a path with a non-existing Long id returns a not found.
     * @throws Exception throws exception if the request fails
     */
    public void base_patching_entity_to_illegal_id_fails() throws Exception {
        T entity = create_entity();

        perform_entity_patch(getEntityPath() + "/" + ILLEGAL_ID, entity)
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }

    /**
     * Tests if a PATCH on a path with a wrong path (String id where Long is expected) fails.
     * @throws Exception throws exception if the request fails
     */
    public void base_patching_entity_to_illegal_string_id_fails() throws Exception {
        T entity = create_entity();

        perform_entity_patch(getEntityPath() + "/" + ILLEGAL_NAME, entity)
                .andExpect(status().isBadRequest())
                .andExpect(string_not_empty());
    }
}
