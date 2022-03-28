package com.osoc6.OSOC6;

import lombok.Getter;
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

    /**
     * Add two test editions to the database.
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
    public ResultActions perform_delete_with_id(final String path, final I id) throws Exception {
        return mockMvc.perform(delete(path + "/" + id.hashCode()));
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