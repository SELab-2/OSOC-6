package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.database.models.CommunicationTemplate;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.dto.CommunicationDTO;
import com.osoc6.OSOC6.repository.CommunicationRepository;
import com.osoc6.OSOC6.repository.CommunicationTemplateRepository;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Communication} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachCommunicationEndpointTests
        extends TestFunctionProvider<Communication, Long, CommunicationRepository> {


    /**
     * The repository which saves, searches, ... {@link CommunicationTemplate} in the database
     */
    @Autowired
    private CommunicationTemplateRepository communicationTemplateRepository;

    /**
     * The repository which saves, searches, ... {@link Communication} in the database
     */
    @Autowired
    private CommunicationRepository communicationRepository;

    /**
     * The repository which saves, searches, ... {@link Student} in the database
     */
    @Autowired
    private StudentRepository studentRepository;

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample {@link CommunicationTemplate} that gets loaded before every test.
     */
    private final CommunicationTemplate testTemplate = new CommunicationTemplate("informative",
            "I have to tell you...");

    /**
     * Test student that is loaded before every test.
     */
    private final Student testStudent = Student.builder()
            .email("jitse@mail.com")
            .additionalStudentInfo("I like boulders")
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
            .pronounsType(PronounsType.OTHER)
            .pronouns(new ArrayList<>(List.of(new String[]{"he", "her", "them"})))
            .writtenMotivation("I love to code!")
            .yearInCourse("3")
            .durationCurrentDegree(5)
            .edition(getBaseUserEdition())
            .motivationURI("www.ILikeApples.com")
            .curriculumVitaeURI("www.my-life-in-bel-air.com")
            .writtenMotivation("www.I-just-want-it.com")
            .build();

    /**
     * Sample {@link Communication} that gets loaded before every test.
     */
    private final Communication testCommunication = new Communication("email",
            "I say yes to you because you look so cool.", testTemplate, getAdminUser(), testStudent);

    /**
     * The actual path communications are served on, with '/' as prefix.
     */
    private static final String COMMUNICATION_PATH = "/" + DumbledorePathWizard.COMMUNICATION_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Dear sir, madam, I think I'm in love with you.";

    public CoachCommunicationEndpointTests() {
        super(COMMUNICATION_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final Communication entity) {
        return entity.getId();
    }

    @Override
    public CommunicationRepository get_repository() {
        return communicationRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        communicationTemplateRepository.save(testTemplate);

        studentRepository.save(testStudent);

        communicationRepository.save(testCommunication);
    }

    @Override
    public void removeSetUpRepository() {
        communicationRepository.deleteAll();

        studentRepository.deleteAll();

        communicationTemplateRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public Communication create_entity() {
        return new Communication("sms", TEST_STRING, testTemplate, getAdminUser(), testStudent);
    }

    @Override
    public Map<String, String> change_entity(final Communication startEntity) {
        return Map.of("content", TEST_STRING);
    }

    @Override
    public String transform_to_json(final Communication entity) {
        CommunicationDTO helper = new CommunicationDTO(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    // ======================= Tests =======================

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_communication_fails() throws Exception {
        // Either return forbidden or 400 because you can not even reference the Template.
        Communication entity = create_entity();
        perform_post(COMMUNICATION_PATH, entity).andExpect(status().is4xxClientError());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_communication_fails() throws Exception {
        Communication entity = get_random_repository_entity();
        perform_delete_with_id(COMMUNICATION_PATH, entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_entity_fails() throws Exception {
        Communication entity = get_random_repository_entity();
        perform_get(COMMUNICATION_PATH + "/" + entity.getId()).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_fails() throws Exception {
        Communication entity = get_random_repository_entity();

        perform_patch(COMMUNICATION_PATH + "/" + entity.getId(), change_entity(entity))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }

    @Test
    @WithUserDetails(value = COACH_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_student_is_forbidden() throws Exception {
        perform_queried_get(getEntityPath() + "/search/findByStudentId",
                new String[]{"studentId"}, new String[]{testStudent.getId().toString()})
                .andExpect(status().isForbidden());
    }
}
