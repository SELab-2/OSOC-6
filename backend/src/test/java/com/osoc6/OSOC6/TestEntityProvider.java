package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.CommunicationTemplate;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.database.models.UserSkill;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;

import java.util.List;

/**
 * This class provides some entities to classes it doesn't need any web so it can be a Utility class.
 */
public final class TestEntityProvider {
    private TestEntityProvider() { }

    public static Student getBaseStudentHe(final BaseTestPerformer<?, ?, ?> performer) {
        return Student.builder()
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
                .edition(performer.getBaseUserEdition())
                .motivationURI("www.I-like-bananas.com")
                .skills(List.of("Gaming on a nice chair", "programming whilst thinking about sleeping"))
                .curriculumVitaeURI("www.my-life-in-ghent.com")
                .writtenMotivation("www.I-just-like-spring.com")
                .build();
    }

    public static Student getBaseStudentOther(final BaseTestPerformer<?, ?, ?> performer) {
        return Student.builder()
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
                .objectivePronoun("he")
                .subjectivePronoun("her")
                .possessivePronoun("them")
                .writtenMotivation("I love to code!")
                .yearInCourse("3")
                .durationCurrentDegree(5)
                .edition(performer.getBaseUserEdition())
                .motivationURI("www.ILikeApples.com")
                .curriculumVitaeURI("www.my-life-in-bel-air.com")
                .writtenMotivation("www.I-just-want-it.com")
                .build();
    }

    public static Project getBaseProject1(final BaseTestPerformer<?, ?, ?> performer) {
        return new Project("New chip", performer.getBaseUserEdition(), "Intel", performer.getAdminUser());
    }

    public static Project getBaseProject2(final BaseTestPerformer<?, ?, ?> performer) {
        return new Project("Instagram", performer.getBaseUserEdition(), "Meta", performer.getAdminUser());
    }

    public static CommunicationTemplate getBaseCommunicationTemplate1(final BaseTestPerformer<?, ?, ?> performer) {
        return new CommunicationTemplate("A well deserved yes",
                "We would like to inform you... You are the best candidate we ever had! We want you! Need you!");
    }

    public static CommunicationTemplate getBaseCommunicationTemplate2(final BaseTestPerformer<?, ?, ?> performer) {
        return new CommunicationTemplate("Love Letter",
                "Romeo Oh romeo thou make my hearth melt.");
    }

    public static Edition getBaseNonActiveEdition(final BaseTestPerformer<?, ?, ?> performer) {
        return new Edition("Edition 1", 0, false);
    }

    public static Edition getBaseActiveEdition(final BaseTestPerformer<?, ?, ?> performer) {
        return new Edition("Edition 2", 1, true);
    }

    public static Invitation getBaseUnusedInvitation(final BaseTestPerformer<?, ?, ?> performer) {
        return new Invitation(performer.getBaseUserEdition(), performer.getAdminUser(), null);
    }

    public static SkillType getBaseSkillType1(final BaseTestPerformer<?, ?, ?> performer) {
        return new SkillType("Skilltype 1", "42B37B");
    }

    public static SkillType getBaseSkillType2(final BaseTestPerformer<?, ?, ?> performer) {
        return new SkillType("Skilltype 2", "C94040");
    }

    public static UserEntity getBaseAdminUserEntity(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserEntity("test.admin@test.com", "Tester The Test", UserRole.ADMIN, "123456");
    }

    public static UserEntity getBaseCoachUserEntity(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserEntity("test.coach@test.com", "Tester The Test", UserRole.COACH, "123456");
    }

    public static UserSkill getBaseAdminUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Active like Duracel bunny", performer.getAdminUser(), "The admin is very active");
    }

    public static UserSkill getBaseCoachUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Coaching with passion", performer.getCoachUser(),
                "I just want my students to learn.");
    }

    public static UserSkill getBaseOutsiderUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Lonely loner", performer.getOutsiderCoach(),
                "Stands outside in the rain and cries.");
    }
}
