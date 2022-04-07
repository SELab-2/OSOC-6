package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.student.EnglishProficiency;
import com.osoc6.OSOC6.database.models.student.Gender;
import com.osoc6.OSOC6.database.models.student.OsocExperience;
import com.osoc6.OSOC6.database.models.student.PronounsType;
import com.osoc6.OSOC6.database.models.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.util.ArrayList;
import java.util.List;


@Data // Provides a serializer we need to convert to json.
public final class StudentJsonHelper {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Gender gender;
    private PronounsType pronounsType;
    private String callName;
    private List<String> pronouns;
    private String mostFluentLanguage;
    private EnglishProficiency englishProficiency;
    private String phoneNumber;
    private String curriculumVitaeURI;
    private String portfolioURI;
    private String motivationURI;
    private String writtenMotivation;
    private String educationLevel;
    private String currentDiploma;
    private Integer durationCurrentDegree;
    private String yearInCourse;
    private String institutionName;
    private String bestSkill;
    private OsocExperience osocExperience;
    private String additionalStudentInfo;
    private List<String> studies;

    private String edition;
    private List<String> skills;
    private List<String> suggestions;
    private List<String> assignments;
    private List<String> communications;

    public StudentJsonHelper(Student student, EntityLinks entityLinks) {
        id = student.getId();
        email = student.getEmail();
        firstName = student.getFirstName();
        lastName = student.getLastName();
        gender = student.getGender();
        pronounsType = student.getPronounsType();
        callName = student.getCallName();
        pronouns = student.getPronouns();
        mostFluentLanguage = student.getMostFluentLanguage();
        englishProficiency = student.getEnglishProficiency();
        phoneNumber = student.getPhoneNumber();
        curriculumVitaeURI = student.getCurriculumVitaeURI();
        portfolioURI = student.getPortfolioURI();
        motivationURI = student.getMotivationURI();
        writtenMotivation = student.getWrittenMotivation();
        educationLevel = student.getEducationLevel();
        currentDiploma = student.getCurrentDiploma();
        durationCurrentDegree = student.getDurationCurrentDegree();
        yearInCourse = student.getYearInCourse();
        institutionName = student.getInstitutionName();
        bestSkill = student.getBestSkill();
        osocExperience = student.getOsocExperience();
        additionalStudentInfo = student.getAdditionalStudentInfo();
        studies = student.getStudies();

        edition = entityLinks.linkToItemResource(Edition.class, student.getEdition().getId().toString()).getHref();

        skills = new ArrayList<>();
        for (Skill skill: student.getSkills()) {
            skills.add(entityLinks.linkToItemResource(Skill.class, skill.getId().toString()).getHref());
        }

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
