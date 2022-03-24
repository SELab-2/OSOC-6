package com.osoc6.OSOC6;

import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;

import java.util.ArrayList;
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
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public abstract class EndpointTest<T> {
    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * Return the {@link MockMvc}.
     * @return mockMvc
     */
    public MockMvc getMockMvc() {
        return mockMvc;
    }

    /**
     * Check every result matcher for an action, if it fails, throw an error.
     * These result matcher check if the result has ex. the right status, contains a certain string,...
     *
     * @param actions  the action we want to perform the checks on
     * @param matchers result matchers used to perform the checks
     * @return a result action can be used for more checks
     * @throws Exception throws exception if a check fails
     */
    private ResultActions check_matchers(final ResultActions actions, final List<ResultMatcher> matchers)
            throws Exception {
        ResultActions resultAction = actions;
        for (ResultMatcher resultMatcher : matchers) {
            resultAction = resultAction.andExpect(resultMatcher);
        }
        return resultAction;
    }

    /**
     * Perform a POST request.
     *
     * @param path   The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to post
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_post(final String path, final T entity, final List<ResultMatcher> matchers)
            throws Exception {
        ResultActions actions =  mockMvc.perform(post(path)
                .content(Util.asJsonString(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
        return check_matchers(actions, matchers);
    }

    /**
     * Perform a GET request.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @param matchers result matchers used to perform checks on the request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_get(final String path, final List<ResultMatcher> matchers) throws Exception {
        ResultActions actions = mockMvc.perform(get(path));
        return check_matchers(actions, matchers);
    }

    /**
     * Perform a GET request.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @param check result matchers used to perform checks on the request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions check_get(final String path, final String check) throws Exception {
        List<ResultMatcher> resultMatchers = new ArrayList<>();
        resultMatchers.add(status().isOk());
        resultMatchers.add(string_to_contains_string(check));
        return perform_get(path, resultMatchers);
    }

    /**
     * Perform a DELETE request.
     *
     * @param path     the path the entity is served on, with '/' as prefix
     * @param id       the id of the entity we want to remove
     * @param matchers result matchers used to perform checks on the request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_delete_with_id(final String path, final Long id, final List<ResultMatcher> matchers)
            throws Exception {
        ResultActions actions = mockMvc.perform(delete(path + "/" + id));
        return check_matchers(actions, matchers);
    }

    /**
     * Perform a Patch request.
     *
     * @param path   The path the entity is served on, with '/' as prefix
     * @param entity The entity we want to post
     * @param matchers result matchers used to perform checks on the request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch(final String path, final T entity, final List<ResultMatcher> matchers)
            throws Exception {
        ResultActions actions = mockMvc.perform(patch(path).content(Util.asJsonString(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
        return check_matchers(actions, matchers);
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
     * Convert a list of {@link String}s to a {@link ResultMatcher} that checks whether the string is contained
     * in the result.
     *
     * @param stringList the strings we want to look for
     * @return a result matcher that can be used to perform checks
     */
    public List<ResultMatcher> contains_strings(final List<String> stringList) {
        List<ResultMatcher> resultMatchers = new ArrayList<>();

        for (String str: stringList) {
            resultMatchers.add(content().string(containsString(str)));
        }
        return resultMatchers;
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
