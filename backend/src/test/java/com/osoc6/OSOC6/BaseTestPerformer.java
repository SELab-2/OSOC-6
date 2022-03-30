package com.osoc6.OSOC6;

import lombok.Getter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Abstract class to help with testing the integration of endpoints.
 * Implements basic functions to be used when creating endpoint tests.
 *
 * @param <T> the entity of the repository using this class
 * @param <I> the id type of the entity
 * @param <R> the repository linked to the entity
 */
public abstract class BaseTestPerformer<T, I extends Serializable, R extends JpaRepository<T, I>> {
    /**
     * This mocks the server without starting it.
     */
    @Autowired @Getter
    private MockMvc mockMvc;

    /**
     * Get the id from an entity, this can be used for multiple purposes.
     * @param entity entity whose id we would like to know
     * @return the id of the entity
     */
    public abstract I get_id(T entity);

    /**
     * Get the repository connected to entity T.
     * @return a repository from entity T
     */
    public abstract R get_repository();

    public abstract void setUpRepository();

    public abstract void removeSetUpRepository();

    /**
     * Set up the repository, with admin authority.
     */
    @BeforeEach
    public void setUp() {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);
        try {
            setUpRepository();
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Remove the setup from the repository, with admin authority.
     */
    @AfterEach
    public void removeSetUp() {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);
        try {
            removeSetUpRepository();
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Transform the entity to a JSON object.
     * @param entity entity to transform
     * @return the JSON object
     */
    public String transform_to_json(final T entity) {
        return Util.asJsonString(entity);
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
                .content(Util.removeEmptyIdFromJson(transform_to_json(entity)))
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
    public ResultActions perform_delete_with_id(final String path, final I id) throws Exception {
        return mockMvc.perform(delete(path + "/" + id.hashCode()));
    }

    /**
     * Perform a PUT request.
     * An id with value null will be removed to avoid exceptions.
     *
     * @param path   The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to put
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_put(final String path, final T entity) throws Exception {
        return mockMvc.perform(put(path).content(Util.removeEmptyIdFromJson(transform_to_json(entity)))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a PATCH request.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param map A map representing the content body (json)
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch(final String path, final Map<String, String> map) throws Exception {
        return mockMvc.perform(patch(path).content(Util.asJsonString(map))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Performs a patch on a single field on the provided path.
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

    /**
     * Get a random entity from the repository.
     * @return a random entity.
     */
    public T get_random_repository_entity() {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        List<T> entities;
        try {
            entities = get_repository().findAll();
        } finally {
            SecurityContextHolder.clearContext();
        }

        return entities.get(0);
    }

    /**
     * Save an entity to the repository.
     * @param entity entity to save
     */
    public void save_repository_entity(final T entity) {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        try {
            get_repository().save(entity);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Delete an entity from the repository.
     * @param entity entity to delete
     */
    public void delete_repository_entity(final T entity) {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        try {
            get_repository().delete(entity);
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Check if the given entity exists.
     * @param entity entity to check existence of
     * @return boolean whether the entity exists or not
     */
    public boolean repository_entity_exists(final T entity) {
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new TestingAuthenticationToken(null, null, "ADMIN"));
        SecurityContextHolder.setContext(securityContext);

        boolean exists;
        try {
            exists = get_repository().existsById(get_id(entity));
        } finally {
            SecurityContextHolder.clearContext();
        }

        return exists;
    }
}
