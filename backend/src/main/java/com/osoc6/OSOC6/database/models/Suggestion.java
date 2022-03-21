package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

/**
 * The database entity for a Suggestion.
 * A suggestion the opinion of a {@link UserEntity} about a {@link com.osoc6.OSOC6.database.models.student.Student} and
 * is independent of a {@link Project}.
 */
@Entity
@NoArgsConstructor
public class Suggestion {
    /**
     * Automatically generated id of Suggestion.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * Strategy this suggestion takes.
     */
    @Basic(optional = false)
    @Getter
    private SuggestionStrategy strategy;

    /**
     * Reason provided by the user for giving this suggestion.
     */
    @Basic(optional = false)
    @Lob
    @Getter
    private String reason;

    /**
     * Coach that did the suggestion.
     */
    @ManyToOne(optional = false)
    @Getter
    private UserEntity coach;

    /**
     * {@link Timestamp} of creation from the suggestion.
     */
    @Basic(optional = false)
    @Getter
    private Timestamp timestamp;

    /**
     *
     * @param newStrategy Yes, maybe or no
     * @param newReason the reason this suggestion was made
     * @param newCoach the coach that made the suggestion
     */
    public Suggestion(final SuggestionStrategy newStrategy, final String newReason, final UserEntity newCoach) {
        strategy = newStrategy;
        reason = newReason;
        coach = newCoach;
        timestamp = new Timestamp(System.currentTimeMillis());
    }
}
