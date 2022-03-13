package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(indexes = {@Index(unique = false, columnList = "timestamp")})
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

    /**
     * {@link CommunicationTemplate} used in this communication.
     */
    @ManyToOne(optional = false)
    private CommunicationTemplate template;

    /**
     * {@link User} that communicated with the student.
     */
    @ManyToOne(optional = false)
    private User user;

    /**
     * Student with whom the communication took place.
     */
    @ManyToOne(optional = false)
    private Student student;


    /**
     * Communication's default no-arg constructor.
     */
    public Communication() { }

    /**
     *
     * @param newTimestamp the timestamp of when the communication-instance was created
     * @param newMedium the medium of the communication, such as SMS or email
     * @param newContent the text content of the communication-instance
     */
    public Communication(final Timestamp newTimestamp, final String newMedium, final String newContent) {
        this.timestamp = newTimestamp;
        this.medium = newMedium;
        this.content = newContent;
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
     * @return communication template used in this communication.
     */
    public CommunicationTemplate getTemplate() {
        return template;
    }

    /**
     *
     * @return User that communicated with the student.
     */
    public User getUser() {
        return user;
    }

    /**
     *
     * @return student with whom the communication took place
     */
    public Student getStudent() {
        return student;
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

    /**
     *
     * @param newTemplate the corrected template used in this communication
     */
    public void setTemplate(final CommunicationTemplate newTemplate) {
        template = newTemplate;
    }

    /**
     *
     * @param newStudent the corrected student with whom this communication took place
     */
    public void setStudent(final Student newStudent) {
        student = newStudent;
    }
}
