package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import com.osoc6.OSOC6.repository.StudentRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link Edition} as an admin.
 */
public final class StudentEndpointTests extends AdminEndpointTest<Student, Long, StudentRepository> {

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

    public StudentEndpointTests() {
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
}
