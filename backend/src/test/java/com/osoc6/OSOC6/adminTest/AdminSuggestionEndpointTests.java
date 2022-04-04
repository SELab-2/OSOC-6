package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.SuggestionStrategy;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.repository.SuggestionRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link Suggestion}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AdminSuggestionEndpointTests extends AdminEndpointTest<Suggestion, Long, SuggestionRepository> {

    /**
     * Sample user.
     */
    private final UserEntity user1 = new UserEntity("test@mail.com", "joe", UserRole.ADMIN, "test");

    private final Edition edition = new Edition();

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
            .edition(edition)
            .build();

    /**
     * First sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion1 = new Suggestion(SuggestionStrategy.YES, "Reason 1", user1, student);

    /**
     * Second sample suggestions that gets loaded before every test.
     */
    private final Suggestion suggestion2 = new Suggestion(SuggestionStrategy.NO, "Reason 2", user1, student);

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
     * The repository which saves, searches, ... a user in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * The repository which saves, searches, ... an edition in the database
     */
    @Autowired
    private EditionRepository editionRepository;

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
        userRepository.save(user1);

        edition.setName("Edition 22");
        edition.setYear(2022);
        edition.setActive(true);

        editionRepository.save(edition);
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
        editionRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Override
    public final Suggestion create_entity() {
        return new Suggestion(SuggestionStrategy.MAYBE, TEST_STRING, user1, student);
    }

    @Override
    public final Map<String, String> change_entity(final Suggestion startEntity) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("reason", TEST_STRING);
        return patchMap;
    }

    @Override
    public String transform_to_json(Suggestion entity) {
        String json = Util.asJsonString(entity);
        String userUrl = entityLinks.linkToItemResource(UserEntity.class, user1.getId().toString()).getHref();
        String studentUrl = entityLinks.linkToItemResource(Student.class, student.getId().toString()).getHref();

        // The regex replaces the whole UserEntity and student object (as json)
        // with urls that points to the right entities.
        json = json.replaceAll("\"coach\":.*}$",
                "\"coach\":\"" + userUrl + "\",\"student\":\"" + studentUrl + "\"}");
        return json;
    }

    /**
     * Transactional is needed because a user gets fetched lazily.
     */
    @Test
    @Override
    @Transactional
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void patch_changes_value() throws Exception {
        super.patch_changes_value();
    }
}
