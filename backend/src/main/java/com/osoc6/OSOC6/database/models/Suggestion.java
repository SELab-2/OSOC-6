package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
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
    private SuggestionStrategy strategy;

    /**
     * Reason provided by the user for giving this suggestion.
     */
    private String reason;

    /**
     * Coach that did the suggestion.
     */
    @ManyToOne(optional = false)
    private User coach;

    /**
     * {@link Timestamp} of creation from the suggestion.
     */
    private Timestamp timestamp;

    /**
     * Suggestion's default no-arg constructor.
     */
    public Suggestion() { }

    /**
     *
     * @param newStrategy Yes, maybe or no
     * @param newReason the reason this suggestion was made
     * @param newCoach the coach that made the suggestion
     */
    public Suggestion(final SuggestionStrategy newStrategy, final String newReason, final User newCoach) {
        strategy = newStrategy;
        reason = newReason;
        coach = newCoach;
        timestamp = new Timestamp(System.currentTimeMillis());
    }

    /**
     *
     * @return strategy this suggestion takes
     */
    public SuggestionStrategy getStrategy() {
        return strategy;
    }

    /**
     *
     * @return reason provided by the user for giving this suggestion
     */
    public String getReason() {
        return reason;
    }

    /**
     *
     * @return User that did the suggestion
     */
    public User getCoach() {
        return coach;
    }

    /**
     *
     * @return timestamp of creation from the suggestion
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }
}
