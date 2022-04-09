package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.SuggestionStrategy;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.dto.SuggestionDTO;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.repository.SuggestionRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Suggestion}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminSuggestionEndpointTests extends AdminEndpointTest<Suggestion, Long, SuggestionRepository> {

    /**
     * First sample student that gets loaded before every test.
     */
    private final Student student = Student.builder()
            .email("jitse@mail.com")
            .additionalStudentInfo("")
            .bestSkill("standing on hands")
            .currentDiploma("Master")
            .educationLevel("Lower level")
            .englishProficiency(EnglishProficiency.FLUENT)
            .firstName("Jitse")
            .lastName("De Smet")
            .callName("Jitse De smet")
            .gender(Gender.MALE)
            .institutionName("Ghent University")
            .mostFluentLanguage("Dutch")
            .osocExperience(OsocExperience.NONE)
            .phoneNumber("+324982672")
            .pronounsType(PronounsType.HE)
            .writtenMotivation("I love to code!")
            .yearInCourse("3")
            .pronouns(new ArrayList<>())
            .durationCurrentDegree(5)
            .edition(getBaseUserEdition())
            .build();

    /**
     * First sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion1 = new Suggestion(SuggestionStrategy.YES, "Reason 1", getCoachUser(), student);

    /**
     * Second sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion2 = new Suggestion(SuggestionStrategy.NO, "Reason 2", getAdminUser(), student);

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
     * The repository which saves, searches, ... a suggestion in the database
     */
    @Autowired
    private SuggestionRepository repository;

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

    public AdminSuggestionEndpointTests() {
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
        setupBasicData();

        studentRepository.save(student);

        repository.save(suggestion1);
        repository.save(suggestion2);
    }

    @Override
    public final void removeSetUpRepository() {
        // All suggestions need to be deleted,
        // Otherwise there will be a relation with the user
        repository.deleteAll();
        studentRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public final Suggestion create_entity() {
        return new Suggestion(SuggestionStrategy.MAYBE, TEST_STRING, getAdminUser(), student);
    }

    @Override
    public final Map<String, String> change_entity(final Suggestion startEntity) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("reason", TEST_STRING);
        return patchMap;
    }

    @Override
    public final String transform_to_json(final Suggestion entity) {
        SuggestionDTO helper = new SuggestionDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    /**
     * Transactional is needed because a user gets fetched lazily.
     */
    @Test
    @Override
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patch_changes_value() throws Exception {
        super.patch_changes_value();
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_matching_query_over_suggest_reason_works() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"reason", "edition"},
                new String[]{suggestion1.getReason(),
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(student.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_non_matching_query_over_suggest_reason_works() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"reason", "edition"},
                new String[]{"apple" + suggestion1.getReason() + "banana",
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(student.getCallName()));
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void student_is_contain_only_once() throws Exception {
        perform_queried_get("/" + DumbledorePathWizard.STUDENT_PATH + "/search/"
                        + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition"},
                new String[]{getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_contains_times_or_less(student.getCallName(), 1));
    }

}
