package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import java.sql.Timestamp;

@Entity
// TODO: @Table(indexes = {@Index(unique = false, name = "Invitation-Edition", columnList = "edition")})
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

    @ManyToOne(optional = false)
    private Edition edition;

    // TODO: cascade type!
    @ManyToOne(optional = false)
    private User issuer;

    @ManyToOne
    private User subject;

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
