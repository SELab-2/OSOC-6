package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.entities.Assignment;
import com.osoc6.OSOC6.entities.ProjectSkill;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.sql.Timestamp;

/**
 * A DTO that helps to convert a {@link Assignment} to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public class AssignmentDTO {
    /**
     * The id of the Assignment.
     */
    private Long id;

    /**
     * Whether assignment is a suggestion (if false this is a definitive assignment made by an admin).
     */
    private Boolean isSuggestion;

    /**
     * Whether assignment is still valid.
     * An assignment can be invalid after conflict resolution.
     * This means we no longer recognise it.
     * A coach can edit this field in their own suggestions since this is the same is making the assignment again.
     */
    private Boolean isValid;

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
     * {@link ProjectSkill} that the student is assigned to.
     */
    private String projectSkill;

    public AssignmentDTO(final Assignment assignment, final EntityLinks entityLinks) {
        id = assignment.getId();
        isSuggestion = assignment.getIsSuggestion();
        isValid = assignment.getIsValid();
        reason = assignment.getReason();

        assigner = entityLinks.linkToItemResource(UserEntity.class,
                assignment.getAssigner().getId().toString()).getHref();

        student = entityLinks.linkToItemResource(Student.class, assignment.getStudent().getId().toString()).getHref();
        projectSkill = entityLinks.linkToItemResource(ProjectSkill.class,
                assignment.getProjectSkill().getId().toString()).getHref();
    }
}
