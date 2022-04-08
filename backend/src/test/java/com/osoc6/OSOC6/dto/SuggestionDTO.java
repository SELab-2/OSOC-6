package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.database.models.SuggestionStrategy;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.sql.Timestamp;

/**
 * A DTO that helps to convert a Suggestion to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class SuggestionDTO {
    /**
     * Automatically generated id of Suggestion.
     */
    private Long id;

    /**
     * Strategy this suggestion takes.
     */
    private SuggestionStrategy strategy;

    /**
     * Reason provided by the user for giving this suggestion.
     */
    private String reason;

    /**
     * {@link Timestamp} of creation from the suggestion.
     */
    private Timestamp timestamp;

    /**
     * Coach that did the suggestion.
     */
    private String coach;

    /**
     * Student that is the subject of this suggestion.
     */
    private String student;

    public SuggestionDTO(final Suggestion suggestion, final EntityLinks entityLinks) {
        id = suggestion.getId();
        strategy = suggestion.getStrategy();
        reason = suggestion.getReason();
        timestamp = suggestion.getTimestamp();

        coach = entityLinks.linkToItemResource(UserEntity.class, suggestion.getCoach().getId().toString()).getHref();
        student = entityLinks.linkToItemResource(Student.class, suggestion.getStudent().getId().toString()).getHref();
    }
}
