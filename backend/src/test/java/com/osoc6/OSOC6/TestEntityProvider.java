package com.osoc6.OSOC6;

import com.osoc6.OSOC6.entities.Assignment;
import com.osoc6.OSOC6.entities.CommunicationTemplate;
import com.osoc6.OSOC6.entities.Edition;
import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.entities.Project;
import com.osoc6.OSOC6.entities.ProjectSkill;
import com.osoc6.OSOC6.entities.SkillType;
import com.osoc6.OSOC6.entities.Suggestion;
import com.osoc6.OSOC6.entities.SuggestionStrategy;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.UserRole;
import com.osoc6.OSOC6.entities.UserSkill;
import com.osoc6.OSOC6.entities.student.EnglishProficiency;
import com.osoc6.OSOC6.entities.student.Gender;
import com.osoc6.OSOC6.entities.student.OsocExperience;
import com.osoc6.OSOC6.entities.student.Status;
import com.osoc6.OSOC6.entities.student.Student;

import java.util.List;

/**
 * This class provides some entities to classes. It doesn't need any web calls so it can be a Utility class.
 * Using this class you can create base entities more easily.
 */
public final class TestEntityProvider {
    private TestEntityProvider() {
    }

    /**
     * Creates a student with pronouns HE.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Student getBaseStudentHe(final BaseTestPerformer<?, ?, ?> performer) {
        return Student.builder()
                .email("kasper@mail.com")
                .additionalStudentInfo("He likes it like that")
                .bestSkill("Finding out the Spring ways")
                .currentDiploma("Master")
                .englishProficiency(EnglishProficiency.FLUENT)
                .firstName("Kasper")
                .lastName("Demeyere")
                .callName("Kasper Demeyere")
                .gender(Gender.MALE)
                .institutionName("Ghent University")
                .mostFluentLanguage("Dutch")
                .osocExperience(OsocExperience.YES_NO_STUDENT_COACH)
                .status(Status.MAYBE)
                .phoneNumber("+324992772")
                .workType("Yes, I can work with a student employment agreement in Belgium")
                .pronouns("he/him/his")
                .writtenMotivation("I love to Spring Spring in java Spring!")
                .yearInCourse("3")
                .durationCurrentDegree(5)
                .funFact("I am groot.")
                .edition(performer.getBaseActiveUserEdition())
                .motivationURI("www.I-like-bananas.com")
                .skills(List.of("Gaming on a nice chair", "programming whilst thinking about sleeping"))
                .curriculumVitaeURI("www.my-life-in-ghent.com")
                .writtenMotivation("www.I-just-like-spring.com")
                .build();
    }

    /**
     * Creates a student with non formatted pronouns.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Student getBaseStudentNonFormattedPronouns(final BaseTestPerformer<?, ?, ?> performer) {
        return Student.builder()
                .email("jitse@mail.com")
                .additionalStudentInfo("I like boulders")
                .bestSkill("standing on hands")
                .currentDiploma("Master")
                .englishProficiency(EnglishProficiency.FLUENT)
                .firstName("Jitse")
                .lastName("De Smet")
                .callName("Jitse De smet")
                .gender(Gender.MALE)
                .institutionName("Ghent University")
                .mostFluentLanguage("Dutch")
                .osocExperience(OsocExperience.NONE)
                .status(Status.APPROVED)
                .phoneNumber("+324982672")
                .workType("Yes, I can work as a volunteer in Belgium")
                .daytimeResponsibilities("Being the boss")
                .pronouns("they")
                .writtenMotivation("I love to code!")
                .yearInCourse("3")
                .durationCurrentDegree(5)
                .edition(performer.getBaseActiveUserEdition())
                .funFact("Boulder de boulder")
                .motivationURI("www.ILikeApples.com")
                .curriculumVitaeURI("www.my-life-in-bel-air.com")
                .writtenMotivation("www.I-just-want-it.com")
                .build();
    }

    /**
     * Creates a base project.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Project getBaseProject1(final BaseTestPerformer<?, ?, ?> performer) {
        return new Project("New chip", performer.getBaseActiveUserEdition(), "Intel", performer.getAdminUser());
    }

    /**
     * Creates a base project.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Project getBaseProject2(final BaseTestPerformer<?, ?, ?> performer) {
        return new Project("Instagram", performer.getBaseActiveUserEdition(), "Meta", performer.getAdminUser());
    }

    /**
     * Creates a base communication template.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static CommunicationTemplate getBaseCommunicationTemplate1(final BaseTestPerformer<?, ?, ?> performer) {
        return new CommunicationTemplate("A well deserved yes", "Selected for OSOC",
                "We would like to inform you... You are the best candidate we ever had! We want you! Need you!");
    }

    /**
     * Creates a base communication template.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static CommunicationTemplate getBaseCommunicationTemplate2(final BaseTestPerformer<?, ?, ?> performer) {
        return new CommunicationTemplate("Love Letter", "A little note",
                "Romeo Oh romeo thou make my hearth melt.");
    }

    /**
     * Creates a non active edition.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Edition getBaseNonActiveEdition(final BaseTestPerformer<?, ?, ?> performer) {
        return new Edition("Edition 1", 0, false);
    }

    /**
     * Creates an active edition.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Edition getBaseActiveEdition(final BaseTestPerformer<?, ?, ?> performer) {
        return new Edition("Edition 2", 1, true);
    }

    /**
     * Creates a non-used invitation.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static Invitation getBaseUnusedInvitation(final BaseTestPerformer<?, ?, ?> performer) {
        return new Invitation(performer.getBaseActiveUserEdition(), performer.getAdminUser(), null);
    }

    /**
     * Creates a basic skilltype.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static SkillType getBaseSkillType1(final BaseTestPerformer<?, ?, ?> performer) {
        return new SkillType("Skilltype 1", "42B37B");
    }

    /**
     * Creates a basic skilltype.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static SkillType getBaseSkillType2(final BaseTestPerformer<?, ?, ?> performer) {
        return new SkillType("Skilltype 2", "C94040");
    }

    /**
     * Creates a base UserEntity that has ADMIN role.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static UserEntity getBaseAdminUserEntity(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserEntity("test.admin@test.com", "Tester The Test", UserRole.ADMIN, "123456");
    }

    /**
     * Creates a base UserEntity that has COACH role.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static UserEntity getBaseCoachUserEntity(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserEntity("test.coach@test.com", "Tester The Test", UserRole.COACH, "123456");
    }

    /**
     * Creates a UserSkill for the admin user.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static UserSkill getBaseAdminUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Active like Duracel bunny", performer.getAdminUser(), "The admin is very active");
    }

    /**
     * Creates a UserSkill for the coach user.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static UserSkill getBaseCoachUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Coaching with passion", performer.getCoachUser(),
                "I just want my students to learn.");
    }

    /**
     * Creates a UserSkill for the outsider user.
     *
     * @param performer the {@link BaseTestPerformer} this entity is created for
     * @return the requested entity
     */
    public static UserSkill getBaseOutsiderUserSkill(final BaseTestPerformer<?, ?, ?> performer) {
        return new UserSkill("Lonely loner", performer.getOutsiderCoach(),
                "Stands outside in the rain and cries.");
    }

    public static ProjectSkill getBaseProjectSkill1(final Project project) {
        return new ProjectSkill("Walk on water", project, "just to be with you!");
    }

    public static ProjectSkill getBaseProjectSkill2(final Project project) {
        return new ProjectSkill("V10 Boulder-er", project, "Strong climber unites");
    }

    public static Assignment getBaseValidAssignment1(final UserEntity user, final Student student,
                                                     final ProjectSkill skill) {
        return new Assignment(true, "Seems like handsome boy", user, student, skill);
    }

    public static Assignment getBaseValidAssignment2(final UserEntity user, final Student student,
                                                     final ProjectSkill skill) {
        return new Assignment(true, "Seems like handsome girl", user, student, skill);
    }

    public static Assignment getBaseNonValidAssignment(final UserEntity user, final Student student,
                                                       final ProjectSkill skill) {
        return new Assignment(false, "A suggestion to be ignored", user, student, skill);
    }

    public static Suggestion getBaseYesSuggestion(final UserEntity user, final Student student) {
        return new Suggestion(SuggestionStrategy.YES, "Reason 1", user, student);
    }

    public static Suggestion getBaseMaybeSuggestion(final UserEntity user, final Student student) {
        return new Suggestion(SuggestionStrategy.MAYBE, "Reason 1", user, student);
    }

    public static Suggestion getBaseNoSuggestion(final UserEntity user, final Student student) {
        return new Suggestion(SuggestionStrategy.NO, "Reason 1", user, student);
    }
}
