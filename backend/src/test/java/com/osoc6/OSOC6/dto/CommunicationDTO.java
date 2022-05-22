package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.entities.Communication;
import com.osoc6.OSOC6.entities.CommunicationTemplate;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.student.Student;
import lombok.Data;
import org.springframework.hateoas.server.EntityLinks;

import java.sql.Timestamp;

/**
 * A DTO that helps to convert a {@link Communication} to its JSON representation.
 * Using this there is no need to write complex regexes to represent relationships.
 */
@Data
public final class CommunicationDTO {
    /**
     * The id of the communication.
     */
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
     * The subject of the communication.
     */
    private String subject = "";

    /**
     * The content of the communication.
     */
    private String content;

    /**
     * {@link CommunicationTemplate} used in this communication.
     */
    private String template;

    /**
     * {@link UserEntity} that communicated with the student.
     */
    private String sender;

    /**
     * Student with whom the communication took place.
     */
    private String student;

    public CommunicationDTO(final Communication communication, final EntityLinks entityLinks) {
        id = communication.getId();
        timestamp = communication.getTimestamp();
        medium = communication.getMedium();
        subject = communication.getSubject();
        content = communication.getContent();

        template = entityLinks.linkToItemResource(CommunicationTemplate.class,
                communication.getTemplate().getId().toString()).getHref();

        sender = entityLinks.linkToItemResource(UserEntity.class,
                communication.getSender().getId().toString()).getHref();

        student = entityLinks.linkToItemResource(Student.class,
                communication.getStudent().getId().toString()).getHref();
    }
}
