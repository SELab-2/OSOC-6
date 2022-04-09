package com.osoc6.OSOC6.adminTest;

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
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Communication} with admin privileges.
 */
public final class AdminCommunicationEndpointTests extends
        AdminEndpointTest<Communication, Long, CommunicationRepository> {

    /**
     * The repository which saves, searches, ... {@link CommunicationTemplate} in the database
     */
    @Autowired
    private CommunicationTemplateRepository communicationTemplateRepository;

    /**
     * The repository which saves, searches, ... {@link CommunicationTemplate} in the database
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
     * First sample edition that gets loaded before every test.
     */
    private final CommunicationTemplate testTemplate = new CommunicationTemplate("informative",
            "I have to tell you...");

    /**
     * Test student that is loaded before every test.
     */
    private final Student testStudent = Student.builder()
            .email("jitse@mail.com")
            .additionalStudentInfo(TEST_STRING)
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
     * First sample edition that gets loaded before every test.
     */
    private final Communication testCommunication = new Communication("email",
            "I say yes to you because you look so cool.", testTemplate, getAdminUser(), testStudent);

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String COMMUNICATION_PATH = "/" + DumbledorePathWizard.COMMUNICATION_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Dear sir, madam, I think I'm in love with you.";

    public AdminCommunicationEndpointTests() {
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

    // ========================== Additional Tests ==========================

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_student_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/findByStudentId",
                new String[]{"studentId"}, new String[]{testStudent.getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(testCommunication.getContent()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_wrong_student_no_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/findByStudentId",
                new String[]{"studentId"}, new String[]{Long.toString(getILLEGAL_ID())})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(testCommunication.getContent()));
    }

}
