package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.database.models.student.Student;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(indexes = {@Index(unique = false, columnList = "timestamp")})
@NoArgsConstructor
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
    @Basic(optional = false)
    @Getter private Timestamp timestamp;

    /**
     * The medium of the communication.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH, nullable = false)
    @Getter @Setter private String medium;

    /**
     * The content of the communication.
     */
    @Basic(optional = true)
    @Lob
    @Getter @Setter private String content;

    /**
     * {@link CommunicationTemplate} used in this communication.
     */
    @ManyToOne(optional = false)
    @Getter @Setter private CommunicationTemplate template;

    /**
     * {@link User} that communicated with the student.
     */
    @ManyToOne(optional = false)
    @Getter private User user;

    /**
     * Student with whom the communication took place.
     */
    @ManyToOne(optional = false)
    @Getter @Setter private Student student;

    /**
     *
     * @param newMedium the medium of the communication, such as SMS or email
     * @param newContent the text content of the communication-instance
     * @param newCommunicationTemplate the template for this communication
     * @param newUser the user who communicated with the student
     * @param newStudent the student with whom the communication took place
     */
    public Communication(final String newMedium, final String newContent,
                         final CommunicationTemplate newCommunicationTemplate, final User newUser,
                         final Student newStudent) {
        super();
        timestamp = new Timestamp(System.currentTimeMillis());
        medium = newMedium;
        content = newContent;
        template = newCommunicationTemplate;
        user = newUser;
        student = newStudent;
    }
}
