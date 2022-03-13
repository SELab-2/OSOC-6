package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.GenerationType;
import javax.persistence.GeneratedValue;
import java.sql.Timestamp;

@Entity
public class Invitation {
    /**
     * The id of the invitation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The timestamp of the invitation.
     */
    private Timestamp timestamp;

    /**
     * Whether the invitation has been used.
     */
    private boolean used;

    /**
     * Invitation's default no-arg constructor.
     */
    public Invitation() { }

    /**
     *
     * @param newTimestamp the timestamp on which the invitation was created
     * @param newUsed whether or not the invitation has been used
     */
    public Invitation(final Timestamp newTimestamp, final boolean newUsed) {
        this.timestamp = newTimestamp;
        this.used = newUsed;
    }

    /**
     *
     * @return The timestamp of the invitation
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }

    /**
     *
     * @return Whether the invitation has been used
     */
    public boolean isUsed() {
        return used;
    }

    /**
     *
     * @param newUsed whether the invitation activated an account
     */
    public void setUsed(final boolean newUsed) {
        used = newUsed;
    }
}
