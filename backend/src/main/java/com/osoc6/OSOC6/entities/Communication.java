package com.osoc6.OSOC6.entities;

import com.osoc6.OSOC6.entities.student.Student;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Timestamp;

/**
 * The database entity for Communication.
 * Communication is used to track the communication of an Admin to a {@link Student}.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "timestamp")})
@NoArgsConstructor
public final class Communication {

    /**
     * The id of the communication.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    /**
     * The timestamp of the communication.
     */
    @Basic(optional = false)
    @Getter
    @CreationTimestamp
    private Timestamp timestamp;

    /**
     * The medium of the communication.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.DEFAULT_DESCRIPTION_LENGTH, nullable = false)
    @Getter @Setter
    private String medium;

    /**
     * The subject of the communication.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String subject = "";

    /**
     * The content of the communication.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String content = "";

    /**
     * {@link CommunicationTemplate} used in this communication.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private CommunicationTemplate template;

    /**
     * {@link UserEntity} that communicated with the student.
     */
    @ManyToOne(optional = false)
    @Getter
    private UserEntity sender;

    /**
     * Student with whom the communication took place.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    @Getter @Setter
    private Student student;

    /**
     *
     * @param newMedium the medium of the communication, such as SMS or email
     * @param newSubject the subject of the communication
     * @param newContent the text content of the communication-instance
     * @param newCommunicationTemplate the template for this communication
     * @param newUserEntity the user who communicated with the student
     * @param newStudent the student with whom the communication took place
     */
    public Communication(final String newMedium, final String newSubject, final String newContent,
                         final CommunicationTemplate newCommunicationTemplate, final UserEntity newUserEntity,
                         final Student newStudent) {
        super();
        timestamp = new Timestamp(System.currentTimeMillis());
        medium = newMedium;
        subject = newSubject;
        content = newContent;
        template = newCommunicationTemplate;
        sender = newUserEntity;
        student = newStudent;
    }
}
