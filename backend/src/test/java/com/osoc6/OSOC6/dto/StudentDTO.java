package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.entities.Assignment;
import com.osoc6.OSOC6.entities.Communication;
import com.osoc6.OSOC6.entities.Edition;
import com.osoc6.OSOC6.entities.Suggestion;
import com.osoc6.OSOC6.entities.student.EnglishProficiency;
import com.osoc6.OSOC6.entities.student.Gender;
import com.osoc6.OSOC6.entities.student.OsocExperience;
import com.osoc6.OSOC6.entities.student.Status;
import com.osoc6.OSOC6.entities.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.util.ArrayList;
import java.util.List;

/**
 * A DTO that helps to convert a student to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data // Provides a serializer we need to convert to json.
public final class StudentDTO {
    /**
     * The id of the student.
     */
    private Long id;

    /**
     * The email of the student.
     */
    private String email;

    /**
     * The first name of the student.
     */
    private String firstName;

    /**
     * The last name of the student.
     */
    private String lastName;

    /**
     * The gender of the student.
     */
    private Gender gender;

    /**
     * The pronouns of the student.
     */
    private String pronouns;

    /**
     * The callName of the student.
     */
    private String callName;


    /**
     * The most fluent language of a person. This is a formatted string.
     */
    private String mostFluentLanguage;

    /**
     * English proficiency rating of a student as described in @{@link EnglishProficiency}.
     */
    private EnglishProficiency englishProficiency;

    /**
     * Formatted string checking the phone number of a student.
     */
    private String phoneNumber;

    /**
     * How the student would like to work for OSOC (employment agreement, volunteer, for free, ...).
     */
    private String workType;

    /**
     * Any responsibilities the student might have which could hinder them during the day.
     */
    private String daytimeResponsibilities;

    /**
     * A URI pointing to the CV of a student.
     */
    private String curriculumVitaeURI;

    /**
     * A URI pointing to the portfolio of the student.
     */
    private String portfolioURI;

    /**
     * A URI pointing to the motivation of the student.
     */
    private String motivationURI;

    /**
     * A written motivation of the student.
     */
    private String writtenMotivation;

    /**
     * Diploma a student is trying to get.
     */

    private String currentDiploma;

    /**
     * Amount of years getting the current degree takes.
     */
    private Integer durationCurrentDegree;

    /**
     * What year the student is in the course.
     * In the form this is a string because you can say already finished.
     * We can not modulate it as a string because both 'already finished' and last year are possibilities.
     * We can therefor not just convert to an int because there are many ways to state these facts.
     */
    private String yearInCourse;

    /**
     * Name of the collage/ university student is enrolled.
     */
    private String institutionName;

    /**
     * The skill the student would describe to be their best.
     */
    private String bestSkill;

    /**
     * Level of Osoc experience as described in @{@link OsocExperience}.
     */
    private OsocExperience osocExperience;

    /**
     * The {@link Status} of a student, used to track which type of mail was last sent to them.
     */
    private Status status;

    /**
     * Additional info that coaches or admins write about students.
     */
    private String additionalStudentInfo;

    /**
     * A fun fact about the student.
     */
    private String funFact;

    /**
     * {@link Edition} as URL in which this communication took place.
     */
    private String edition;

    /**
     * The Studies this student has done.
     */
    private List<String> studies;

    /**
     * The skills this student has as URL.
     * In the form this is called the 'role' a student applies for.
     */
    private List<String> skills;

    /**
     * The suggestions made about this student as URL.
     */
    private List<String> suggestions;

    /**
     * The assignments made about this student as URL.
     */
    private List<String> assignments;

    /**
     * Communication that this student has received as URL.
     */
    private List<String> communications;

    public StudentDTO(final Student student, final EntityLinks entityLinks) {
        id = student.getId();
        email = student.getEmail();
        firstName = student.getFirstName();
        lastName = student.getLastName();
        gender = student.getGender();
        pronouns = student.getPronouns();
        callName = student.getCallName();
        mostFluentLanguage = student.getMostFluentLanguage();
        englishProficiency = student.getEnglishProficiency();
        phoneNumber = student.getPhoneNumber();
        workType = student.getWorkType();
        daytimeResponsibilities = student.getDaytimeResponsibilities();
        curriculumVitaeURI = student.getCurriculumVitaeURI();
        portfolioURI = student.getPortfolioURI();
        motivationURI = student.getMotivationURI();
        writtenMotivation = student.getWrittenMotivation();
        currentDiploma = student.getCurrentDiploma();
        durationCurrentDegree = student.getDurationCurrentDegree();
        yearInCourse = student.getYearInCourse();
        institutionName = student.getInstitutionName();
        bestSkill = student.getBestSkill();
        osocExperience = student.getOsocExperience();
        status = student.getStatus();
        additionalStudentInfo = student.getAdditionalStudentInfo();
        funFact = student.getFunFact();
        studies = student.getStudies();

        edition = entityLinks.linkToItemResource(Edition.class, student.getEdition().getId().toString()).getHref();

        skills = student.getSkills();

        suggestions = new ArrayList<>();
        for (Suggestion suggestion: student.getSuggestions()) {
            suggestions.add(entityLinks.linkToItemResource(Suggestion.class,
                    suggestion.getId().toString()).getHref());
        }

        assignments = new ArrayList<>();
        for (Assignment assignment: student.getAssignments()) {
            assignments.add(entityLinks.linkToItemResource(Assignment.class,
                    assignment.getId().toString()).getHref());
        }

        communications = new ArrayList<>();
        for (Communication communication: student.getCommunications()) {
            communications.add(entityLinks.linkToItemResource(Communication.class,
                    communication.getId().toString()).getHref());
        }
    }
}
