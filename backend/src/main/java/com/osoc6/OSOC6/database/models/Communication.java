package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Entity
public class Communication {

    /**
     * The id of the communication.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The timestamp of the communication.
     */
    private Timestamp timestamp;

    /**
     * The medium of the communication.
     */
    private String medium;

    /**
     * The content of the communication.
     */
    private String content;

    // Relation with CommunicationTemplate.

    /**
     * Communication's default no-arg constructor
     */
    public Communication() {}

    /**
     *
     * @param timestamp the timestamp of when the communication-instance was created
     * @param medium the medium of the communication, such as SMS or email
     * @param content the text content of the communication-instance
     */
    public Communication(Timestamp timestamp, String medium, String content) {
        this.timestamp = timestamp;
        this.medium = medium;
        this.content = content;
    }

    /**
     *
     * @return the timestamp of the communication
     */
    public Timestamp getTimestamp() {
        return timestamp;
    }

    /**
     *
     * @return the medium of the communication
     */
    public String getMedium() {
        return medium;
    }

    /**
     *
     * @return the content of the communication
     */
    public String getContent() {
        return content;
    }

    /**
     *
     * @param newTimestamp timestamp the communication happened
     */
    public void setTimestamp(final Timestamp newTimestamp) {
        timestamp = newTimestamp;
    }

    /**
     *
     * @param newMedium medium that was used for the communication: email, sms, ...
     */
    public void setMedium(final String newMedium) {
        medium = newMedium;
    }

    /**
     *
     * @param newContent the content of the communication. This can also be a summary of an IRL conversation.
     */
    public void setContent(final String newContent) {
        content = newContent;
    }
}
