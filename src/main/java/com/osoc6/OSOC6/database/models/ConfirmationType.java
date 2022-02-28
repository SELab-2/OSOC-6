package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ConfirmationType {
    @Id
    String name;
    String template;

    public String getName() {
        return name;
    }

    public String getTemplate() {
        return template;
    }
}
