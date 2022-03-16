package com.osoc6.OSOC6.database.models;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class CommunicationTemplate {

    /**
     * The name of the CommunicationTemplate.
     */
    @Id
    private String name;

    /**
     * The template for the CommunicationTemplate.
     */
    @Basic(optional = false)
    @Lob
    private String template;

    /**
     * CommunicationTemplate's default no-arg constructor.
     */
    public CommunicationTemplate() { }

    /**
     *
     * @param newName the name of the template
     * @param newTemplate the content of the template
     */
    public CommunicationTemplate(final String newName, final String newTemplate) {
        name = newName;
        template = newTemplate;
    }

    /**
     *
     * @return the name of the ConfirmationType
     */
    public String getName() {
        return name;
    }

    /**
     *
     * @return the template of the ConfirmationType
     */
    public String getTemplate() {
        return template;
    }


    /**
     *
     * @param newName name of the communication template, 'yes', 'no', 'maybe', 'invitation', ...
     */
    public void setName(final String newName) {
        name = newName;
    }

    /**
     *
     * @param newTemplate the string template representation
     */
    public void setTemplate(final String newTemplate) {
        template = newTemplate;
    }
}
