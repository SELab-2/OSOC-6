package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.UserRepository;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.io.Serializable;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

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
 * Provides an edition, coachUser, adminUser and invitation when
 * base setup and base removed are called in the setup and remove functions.
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
     * The edition repository which saves, searches, ... Editions in the database
     */
    @Autowired
    private EditionRepository editionRepository;

    /**
     * The user repository which saves, searches, ... UserEntities in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * The invitation repository which saves, searches, ... Invitations in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * The test edition. Used so that our test users can be linked to an edition.
     */
    @Getter
    private final Edition baseUserEdition = new Edition("Basic test edition", 2022, true);

    /**
     * Email of the admin as a static final field. This way it can be used within annotations.
     */
    protected static final String ADMIN_EMAIL = "admin@test.com";

    /**
     * Email of the coach as a static final field. This way it can be used within annotations.
     */
    protected static final String COACH_EMAIL = "coach@test.com";

    /**
     * Email of the outsider coach as a static final field. This way it can be used within annotations.
     */
    public static final String OUTSIDER_EMAIL = "outsider@mail.com";

    /**
     * The admin test user. This is the admin user that will be used to execute the tests.
     */
    @Getter
    private final UserEntity adminUser = new UserEntity(ADMIN_EMAIL, "admin testuser",
            UserRole.ADMIN, "123456");

    /**
     * The coach sample user that gets loaded before every test.
     */
    @Getter
    private final UserEntity coachUser = new UserEntity(COACH_EMAIL, "coach testuser",
            UserRole.COACH, "123456");

    /**
     * The outsider coach sample user that gets loaded before every test.
     */
    @Getter
    private final UserEntity outsiderCoach = new UserEntity(OUTSIDER_EMAIL, "joe", UserRole.COACH, "test");

    /**
     * The invitation for the coach user. Makes it so the user is linked to an edition.
     */
    private final Invitation invitationForCoach = new Invitation(baseUserEdition, coachUser, coachUser);

    /**
     * Load the needed edition, users and invitation.
     */
    public void setupBasicData() {
        editionRepository.save(baseUserEdition);

        userRepository.save(adminUser);
        userRepository.save(coachUser);
        userRepository.save(outsiderCoach);

        invitationRepository.save(invitationForCoach);
    }

    /**
     * Remove the edition, users and invitation.
     */
    public void removeBasicData() {
        invitationRepository.deleteAll();

        userRepository.deleteAll();

        editionRepository.deleteAll();
    }

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
     * Execute the given lambda with admin authorization.
     * @param lambda the lambda to execute
     */
    protected void performAsAdmin(final Runnable lambda) {
        try {
            SecurityContext securityContext = new SecurityContextImpl();
            securityContext.setAuthentication(
                    new TestingAuthenticationToken(null, null, "ADMIN"));
            SecurityContextHolder.setContext(securityContext);
            lambda.run();
        } finally {
            SecurityContextHolder.clearContext();
        }
    }

    /**
     * Set up the repository, with admin authority.
     */
    @BeforeEach
    public void setUp() {
        performAsAdmin(this::setUpRepository);
    }

    /**
     * Remove the setup from the repository, with admin authority.
     */
    @AfterEach
    public void removeSetUp() {
        performAsAdmin(this::removeSetUpRepository);
    }

    /**
     * Transform the entity to a JSON object.
     * A super class can override this function to alter the JSON format of the entity.
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
                .content(transform_to_json(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a GET request.
     *
     * @param path the path the resource is served on, with '/' as prefix
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_get(final String path) throws Exception {
        return mockMvc.perform(get(path));
    }

    /**
     * Perform a get with queries.
     * @param path the path the resource is served on, with '/' as prefix
     * @param paramNames the names of the parameters
     * @param values the value of the parameters (same order as paramNames)
     * @return a result action that can be used for more checks
     * @throws Exception if the request or a check fails
     */
    public ResultActions perform_queried_get(final String path, final String[] paramNames,
                                             final String[] values)throws Exception {
        MockHttpServletRequestBuilder builder = get(path);
        for (int i = 0; i < paramNames.length; i++) {
            builder = builder.queryParam(paramNames[i], values[i]);
        }
        return mockMvc.perform(builder);
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
        return mockMvc.perform(put(path).content(transform_to_json(entity))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a PATCH request with select content.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param patchBody The body of the patch request
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch(final String path, final String patchBody) throws Exception {
        return mockMvc.perform(patch(path).content(patchBody)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    /**
     * Perform a PATCH request with select fields.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param map A map representing the content body (json)
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_patch(final String path, final Map<String, String> map) throws Exception {
        return perform_patch(path, Util.asJsonString(map));
    }

    /**
     * Perform a PATCH request with the (full) entity.
     *
     * @param path The path the entity is served on, with '/' as prefix
     * @param entity The entity to patch
     * @return a result action that can be used for more checks
     * @throws Exception throws exception if the request or a check fails
     */
    public ResultActions perform_entity_patch(final String path, final T entity) throws Exception {
        return mockMvc.perform(patch(path).content(transform_to_json(entity))
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
     * Convert a {@link String} to a {@link ResultMatcher} that checks whether
     * the string is not contained in the result.
     *
     * @param str the string we want to look for
     * @return a result matcher that can be used to perform checks
     */
    public ResultMatcher string_not_to_contains_string(final String str) {
        return content().string(not(containsString(str)));
    }

    /**
     * Creates a resultMatcher that checks if a string is contained a maximum count.
     *
     * @param str the string that should be contained a limited amount of times
     * @param maxCount the maximum amount of times the string can be contained. A count of maxCount is allowed
     * @return a result matcher that can be used to perform a mex contains test
     */
    public ResultMatcher string_contains_times_or_less(final String str, final int maxCount) {
        return result -> {
            int containsCount = 0;
            String content = result.getResponse().getContentAsString();
            int firstIndex = content.indexOf(str);
            while (firstIndex != -1) {
                content = content.substring(firstIndex + str.length());
                firstIndex = content.indexOf(str);
                containsCount++;
            }
            if (containsCount > maxCount) {
                throw new Exception("Contains string " + str + " more than allowed "
                        + maxCount + " times.");
            }
        };
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
        AtomicReference<T> entity = new AtomicReference<>();
        performAsAdmin(() -> entity.set(get_repository().findAll().get(0)));
        return entity.get();
    }

    /**
     * Save an entity to the repository.
     * @param entity entity to save
     */
    public void save_repository_entity(final T entity) {
        performAsAdmin(() -> get_repository().save(entity));

    }

    /**
     * Delete an entity from the repository.
     * @param entity entity to delete
     */
    public void delete_repository_entity(final T entity) {
        performAsAdmin(() -> get_repository().delete(entity));
    }

    /**
     * Check if the given entity exists.
     * @param entity entity to check existence of
     * @return boolean whether the entity exists or not
     */
    public boolean repository_entity_exists(final T entity) {
        AtomicBoolean exists = new AtomicBoolean(false);
        performAsAdmin(() -> exists.set(get_repository().existsById(get_id(entity))));
        return exists.get();
    }
}
