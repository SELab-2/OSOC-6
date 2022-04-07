package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.StudentJsonHelper;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Edition} as an admin.
 */
public final class AdminStudentEndpointTests extends AdminEndpointTest<Student, Long, StudentRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private StudentRepository studentRepository;

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String STUDENTS_PATH = "/" + DumbledorePathWizard.STUDENT_PATH;

    private final Student studentKasper = Student.builder()
            .email("kasper@mail.com")
            .additionalStudentInfo("He likes it like that")
            .bestSkill("Finding out the Spring ways")
            .currentDiploma("Master")
            .educationLevel("higher level")
            .englishProficiency(EnglishProficiency.FLUENT)
            .firstName("Kasper")
            .lastName("Demeyere")
            .callName("Kasper Demeyere")
            .gender(Gender.MALE)
            .institutionName("Ghent University")
            .mostFluentLanguage("Dutch")
            .osocExperience(OsocExperience.YES_NO_STUDENT_COACH)
            .phoneNumber("+324992772")
            .pronounsType(PronounsType.HE)
            .writtenMotivation("I love to Spring Spring in java Spring!")
            .yearInCourse("3")
            .durationCurrentDegree(5)
            .edition(getBaseUserEdition())
            .motivationURI("www.I-like-bananas.com")
            .curriculumVitaeURI("www.my-life-in-ghent.com")
            .writtenMotivation("www.I-just-like-spring.com")
            .build();

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Bananas are my signature dish";

    /**
     * Entity links, needed to get to link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    public AdminStudentEndpointTests() {
        super(STUDENTS_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(Student entity) {
        return entity.getId();
    }

    @Override
    public StudentRepository get_repository() {
        return studentRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        studentRepository.save(studentKasper);
    }

    @Override
    public void removeSetUpRepository() {
        studentRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public Student create_entity() {
        return Student.builder()
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
                .pronounsType(PronounsType.HE)
                .writtenMotivation("I love to code!")
                .yearInCourse("3")
                .durationCurrentDegree(5)
                .edition(getBaseUserEdition())
                .motivationURI("www.ILikeApples.com")
                .curriculumVitaeURI("www.my-life-in-bel-air.com")
                .writtenMotivation("www.I-just-want-it.com")
                .build();
    }

    @Override
    public Map<String, String> change_entity(Student startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("additionalStudentInfo", TEST_STRING);
        return changeMap;
    }

    /**
     * Transforms a Student to his correct String representation.
     * @param entity entity to transform
     * @return the string representation
     */
    @Override
    public String transform_to_json(final Student entity) {
        StudentJsonHelper helper = new StudentJsonHelper(entity, entityLinks);
        return Util.asJsonString(helper);
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_edition_works_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{studentKasper.getCallName(), getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(studentKasper.getCallName()));

        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{"banana" + studentKasper.getCallName() + "apple", getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void filtering_on_false_edition_works_not_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"callName", "edition"},
                new String[]{studentKasper.getCallName(), Long.toString(getILLEGAL_ID())})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_no_args_has_no_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{},
                new String[]{})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_first_name_works() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"firstName", "edition"},
                new String[]{studentKasper.getFirstName(), getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_first_name_works_no_results() throws Exception {
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"firstName", "edition"},
                new String[]{"apple" + studentKasper.getFirstName() + "banana",
                        getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_not_to_contains_string(studentKasper.getCallName()));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void queried_all_works_with_results() throws Exception {
        //base_get_all_entities_succeeds().andDo(print());
        perform_queried_get(getEntityPath() + "/search/" + DumbledorePathWizard.STUDENT_QUERY_PATH,
                new String[]{"edition"},
                new String[]{getBaseUserEdition().getId().toString()})
                .andExpect(status().isOk())
                .andExpect(string_to_contains_string(studentKasper.getCallName()));
    }
}
