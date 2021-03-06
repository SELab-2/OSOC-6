package com.osoc6.OSOC6.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.entities.student.Student;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

/**
 * The database entity for a Suggestion.
 * A suggestion is the opinion of a {@link UserEntity} about a {@link Student}
 * and is independent of a {@link Project}.
 */
@Entity
@NoArgsConstructor
public final class Suggestion implements WeakToEdition {
    /**
     * Automatically generated id of Suggestion.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    /**
     * Strategy this suggestion takes.
     */
    @Basic(optional = false)
    @Getter @Setter
    private SuggestionStrategy strategy;

    /**
     * Reason provided by the user for giving this suggestion.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String reason;

    /**
     * {@link Timestamp} of creation from the suggestion.
     */
    @Basic(optional = false)
    @CreationTimestamp
    @Getter
    private Timestamp timestamp;

    /**
     * Coach that did the suggestion.
     */
    @ManyToOne(optional = false)
    @Getter
    private UserEntity coach;

    /**
     * Student that is the subject of this suggestion.
     */
    @ManyToOne(optional = false, cascade = {})
    @ReadOnlyProperty
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    @Getter
    private Student student;

    /**
     *
     * @param newStrategy Yes, maybe or no
     * @param newReason the reason this suggestion was made
     * @param newCoach the coach that made the suggestion
     * @param newStudent the student that is the subject of this suggestion
     */
    public Suggestion(final SuggestionStrategy newStrategy, final String newReason, final UserEntity newCoach,
                      final Student newStudent) {
        strategy = newStrategy;
        reason = newReason;
        coach = newCoach;
        student = newStudent;
    }

    @Override @JsonIgnore
    public Edition getControllingEdition() {
        return student.getEdition();
    }
}
