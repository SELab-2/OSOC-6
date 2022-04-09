package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.sql.Timestamp;

/**
 * A DTO that helps to convert a Invitation to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public class AssignmentDTO {
    /**
     * The id of the Assignment.
     */
    private Long id;

    /**
     * whether assignment is a suggestion (if false this is a definitive assignment made by an admin).
     */
    private Boolean isSuggestion;

    /**
     * The creation timestamp of the assignment.
     */
    private final Timestamp timestamp = new Timestamp(System.currentTimeMillis());

    /**
     * The reason the student got assigned.
     */
    private String reason;

    /**
     * The {@link UserEntity}/ Admin that executed the assignment.
     */
    private String assigner;

    /**
     * Student that gets assigned.
     * Fetch lazy because a student is a very big entity
     */
    private String student;

    /**
     * Project that the student is assigned to.
     */
    private String project;

    public AssignmentDTO(final Assignment assignment, final EntityLinks entityLinks) {
        id = assignment.getId();
        isSuggestion = assignment.getIsSuggestion();
        reason = assignment.getReason();

        assigner = entityLinks.linkToItemResource(UserEntity.class,
                assignment.getAssigner().getId().toString()).getHref();

        student = entityLinks.linkToItemResource(Student.class, assignment.getStudent().getId().toString()).getHref();
        project = entityLinks.linkToItemResource(Project.class, assignment.getProject().getId().toString()).getHref();
    }
}
