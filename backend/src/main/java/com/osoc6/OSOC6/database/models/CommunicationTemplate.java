package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
@NoArgsConstructor
public class CommunicationTemplate {

    /**
     * The name of the CommunicationTemplate.
     */
    @Id
    @Getter @Setter
    private String name;

    /**
     * The template for the CommunicationTemplate.
     */
    @Basic(optional = false)
    @Lob
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
