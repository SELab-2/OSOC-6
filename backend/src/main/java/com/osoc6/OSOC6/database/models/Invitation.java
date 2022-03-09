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
     * @param newTimestamp timestamp of the creation of the invitation
     */
    public void setTimestamp(final Timestamp newTimestamp) {
        timestamp = newTimestamp;
    }

    /**
     *
     * @param newUsed whether the invitation activated an account
     */
    public void setUsed(final boolean newUsed) {
        used = newUsed;
    }
}
