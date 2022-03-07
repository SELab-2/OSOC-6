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
     * The id of the invitation's edition.
     */
    private Long editionId;

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
     * @return The id of the invitation
     */
    public Long getId() {
        return id;
    }

    /**
     *
     * @return The id of the invitation's edition
     */
    public Long getEditionId() {
        return editionId;
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
}
