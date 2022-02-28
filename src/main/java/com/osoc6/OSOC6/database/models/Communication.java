package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Entity
public class Communication {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; // TODO: Id of weak entities

    private Timestamp timestamp;
    private String medium;
    private String content;

    public Long getId() {
        return id;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public String getMedium() {
        return medium;
    }

    public String getContent() {
        return content;
    }
}
