package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.SuggestionStrategy;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.dto.SuggestionDTO;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.repository.SuggestionRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Suggestion} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachSuggestionEndpointTests extends TestFunctionProvider<Suggestion, Long, SuggestionRepository> {

    /**
     * First sample student that gets loaded before every test.
     */
    private final Student student = TestEntityProvider.getBaseStudentOther(this);

    /**
     * First sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion1 = new Suggestion(SuggestionStrategy.YES, "Reason 1", getCoachUser(), student);

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
    private SuggestionRepository suggestionRepository;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * The repository which saves, searches, ... a student in the database
     */
    @Autowired
    private StudentRepository studentRepository;

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
        return suggestionRepository;
    }

    /**
     * Add two test suggestions to the database.
     */
    @Override
    public void setUpRepository() {
        setupBasicData();

        studentRepository.save(student);

        suggestionRepository.save(suggestion1);
    }

    @Override
    public final void removeSetUpRepository() {
        // All suggestions need to be deleted,
        // Otherwise there will be a relation with the user
        suggestionRepository.deleteAll();
        studentRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public final Suggestion create_entity() {
        return new Suggestion(SuggestionStrategy.MAYBE, TEST_STRING, getCoachUser(), student);
    }

    @Override
    public final Map<String, String> change_entity(final Suggestion startEntity) {
        return Map.of("reason", TEST_STRING);
    }

    @Override
    public final String transform_to_json(final Suggestion entity) {
        SuggestionDTO helper = new SuggestionDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new() throws Exception {
        Suggestion suggestion = create_entity();

        perform_post(getEntityPath(), suggestion).andExpect(status().isCreated());
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_to_other_edition_fails() throws Exception {
        // This is either forbidden because the user cannot post a suggestion to an edition that is not his.
        // or a bad request because the user is unable to see the student in the first place.
        Suggestion suggestion = new Suggestion(SuggestionStrategy.MAYBE, "Nice personality",
                getOutsiderCoach(), student);
        perform_post(getEntityPath(), suggestion).andExpect(status().is4xxClientError());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_with_matching_edition_works() throws Exception {
        base_getting_legal_entity_succeeds();
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_with_wrong_edition_fails() throws Exception {
        Suggestion suggestion = get_random_repository_entity();
        perform_get(getEntityPath() + "/" + suggestion.getId()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void posting_with_other_coach_id_fails() throws Exception {
        Suggestion suggestion = new Suggestion(SuggestionStrategy.MAYBE, "Nice personality",
                getOutsiderCoach(), student);
        perform_post(getEntityPath(), suggestion).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_own_suggestion_works() throws Exception {
        Suggestion entity = get_random_repository_entity();
        perform_delete_with_id(SUGGESTION_PATH, entity.getId())
                .andExpect(status().isNoContent());
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_other_suggestion_fails() throws Exception {
        Suggestion entity = get_random_repository_entity();
        perform_delete_with_id(SUGGESTION_PATH, entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        Suggestion entity = get_random_repository_entity();

        perform_patch(SUGGESTION_PATH + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = OUTSIDER_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_all_suggestions_fails() throws Exception {
        perform_get(getEntityPath()).andExpect(status().isForbidden());
    }
}
