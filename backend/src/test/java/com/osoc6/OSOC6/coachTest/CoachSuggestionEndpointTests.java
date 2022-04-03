package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.SuggestionStrategy;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.SuggestionRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.ResultActions;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Suggestion} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachSuggestionEndpointTests extends TestFunctionProvider<Suggestion, Long, SuggestionRepository> {

    /**
     * Sample user.
     */
    private final UserEntity user1 = new UserEntity("test@mail.com", "joe", UserRole.COACH, "test");

    /**
     * Sample user2.
     */
    private final UserEntity user2 = new UserEntity("test2@mail.com", "joe2", UserRole.COACH, "test");

    /**
     * First sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion1 = new Suggestion(SuggestionStrategy.YES, "Reason 1", user1);

    /**
     * Second sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion2 = new Suggestion(SuggestionStrategy.NO, "Reason 2", user1);

    /**
     * The actual path suggestion are served on, with '/' as prefix.
     */
    private static final String SUGGESTION_PATH = "/" + DumbledorePathWizard.SUGGESTION_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "TEST REASON";

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private SuggestionRepository repository;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    public CoachSuggestionEndpointTests() {
        super(SUGGESTION_PATH, TEST_STRING);
    }

    @Override
    public final Long get_id(final Suggestion entity) {
        return entity.getId();
    }

    @Override
    public final SuggestionRepository get_repository() {
        return repository;
    }

    /**
     * Add two test suggestions to the database.
     */
    @Override
    public void setUpRepository() {
        // Needed for database relation
        userRepository.save(user1);
        userRepository.save(user2);


        repository.save(suggestion1);
        repository.save(suggestion2);
    }

    @Override
    public final void removeSetUpRepository() {
        // All suggestions need to be deleted,
        // Otherwise there will be a relation with the user
        repository.deleteAll();

        if (userRepository.existsById(user1.getId())) {
            userRepository.deleteById(user1.getId());
        }
        if (userRepository.existsById(user2.getId())) {
            userRepository.deleteById(user2.getId());
        }
    }

    @Override
    public final Suggestion create_entity() {
        return new Suggestion(SuggestionStrategy.MAYBE, TEST_STRING, user1);
    }

    @Override
    public final Map<String, String> change_entity(final Suggestion startEntity) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("reason", TEST_STRING);
        return patchMap;
    }

    @Override
    public final ResultActions perform_post(final String path, final Suggestion entity) throws Exception {
        String json = transform_to_json(entity);
        String entityToUrl = entityLinks.linkToItemResource(Suggestion.class, user1.getId().toString()).getHref();

        // The regex replaces the whole UserEntity object (as json) with a url which points to the right entity.
        json = json.replaceAll("coach\":.*},", "coach\":\"" + entityToUrl + "\",");

        return getMockMvc().perform(post(SUGGESTION_PATH)
                .content(json)
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new() throws Exception {
        Suggestion entity = create_entity();

        perform_post(getEntityPath(), entity);
        check_get(getEntityPath(), getTestString());
    }

    @Test
    @WithUserDetails(value = "test2@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_other_user_fails() throws Exception {
        Suggestion entity = create_entity();

        perform_post(getEntityPath(), entity).andExpect(status().isBadRequest());
    }

    @Test
    @WithUserDetails(value = "test2@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_suggestion_fails() throws Exception {
        Suggestion entity = get_random_repository_entity();
        perform_delete_with_id(SUGGESTION_PATH, entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_fails() throws Exception {
        Suggestion entity = get_random_repository_entity();

        perform_patch(SUGGESTION_PATH + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}
