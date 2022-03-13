package com.osoc6.OSOC6.database.models;


import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class Suggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Basic
    private SuggestionStrategy strategy;

    @Basic
    private String reason;

    @ManyToOne(optional = false)
    private User coach;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }



}
