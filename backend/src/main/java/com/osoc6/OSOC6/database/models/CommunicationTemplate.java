package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

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
    private String template;

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
