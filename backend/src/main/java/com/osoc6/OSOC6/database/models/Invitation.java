package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
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
     * {@link Edition} for which this invitation was created.
     */
    @ManyToOne(optional = false)
    private Edition edition;

    /**
     * User that issued the invitation.
     */
    @ManyToOne(optional = false)
    private User issuer;

    /**
     * User that accepted the invitation.
     */
    @ManyToOne
    private User subject;

    /**
     * Invitation's default no-arg constructor.
     */
    public Invitation() { }

    /**
     *
     * @param newEdition the edition of the invitation
     * @param newIssuer user that issued the invitation
     * @param newSubject user that accepted the invitation
     */
    public Invitation(final Edition newEdition, final User newIssuer, final User newSubject) {
        timestamp = new Timestamp(System.currentTimeMillis());
        edition = newEdition;
        issuer = newIssuer;
        subject = newSubject;
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
     * @return edition for which this invitation was created
     */
    public Edition getEdition() {
        return edition;
    }

    /**
     *
     * @return user that created the invitation
     */
    public User getIssuer() {
        return issuer;
    }

    /**
     *
     * @return User that accepted the invitation
     */
    public User getSubject() {
        return subject;
    }

    /**
     *
     * @return Whether the invitation has been used
     */
    public boolean isUsed() {
        return subject != null;
    }

    /**
     *
     * @param newSubject User that accepts the invitation
     */
    public void setSubject(final User newSubject) {
        subject = newSubject;
    }
}
