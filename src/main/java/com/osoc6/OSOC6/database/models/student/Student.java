package com.osoc6.OSOC6.database.models.student;

import javax.persistence.*;
import java.util.List;

@Entity
public class Student {

    private String email;
    private String firstName;
    private String lastName;
    private PronounsType pronounsType;
    private CallnameType callnameType;
    private String callname;

    // TODO: is this restricted to length 3?
    @ElementCollection
    private List<String> pronouns;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public Long getId() {
        return id;
    }

    public PronounsType getPronounsType() {
        return pronounsType;
    }

    public CallnameType getCallnameType() {
        return callnameType;
    }

    public List<String> getPronouns() {
        return pronouns;
    }

    public String getCallname() {
        return callname;
    }
}
