package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

/**
 * The database entity for a CommunicationTemplate.
 * A communication template is a template that can be used to send mails more quickly.
 * A mail is not sent from within the tool but the tool can redirect you to your mail client.
 */
@Entity
@NoArgsConstructor
public final class CommunicationTemplate {
    /**
     * The id of the CommunicationTemplate.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    /**
     * The name of the CommunicationTemplate.
     */
    @NaturalId
    @Getter @Setter
    private String name;

    /**
     * The template for the CommunicationTemplate.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String template;

    /**
     *
     * @param newName the name of the template
     * @param newTemplate the content of the template
     */
    public CommunicationTemplate(final String newName, final String newTemplate) {
        super();
        name = newName;
        template = newTemplate;
    }
}
