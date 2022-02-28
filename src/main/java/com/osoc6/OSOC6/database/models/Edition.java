package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Edition {

    private Date year;
    private boolean active;

    @Id
    private String name;

    public boolean isActive() {
        return active;
    }

    public String getName() {
        return name;
    }

    public Date getYear() {
        return year;
    }
}
