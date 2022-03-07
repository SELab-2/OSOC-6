package com.osoc6.OSOC6.database.models.student;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.GenerationType;
import java.util.List;

@Entity
public class Student {
    /**
     * The email of the student.
     */
    private String email;

    /**
     * The first name of the student.
     */
    private String firstName;

    /**
     * The last name of the student.
     */
    private String lastName;

    /**
     * The PronounsType of the student.
     */
    private PronounsType pronounsType;

    /**
     * The CallnameType of the student.
     */
    private CallnameType callnameType;

    /**
     * The callname of the student.
     */
    private String callname;

    //private Role projectRole;

    /**
     * The pronouns of the student.
     */
    @ElementCollection
    private List<String> pronouns;

    /**
     * The id of the student.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     *
     * @return the email of the student
     */
    public String getEmail() {
        return email;
    }

    /**
     *
     * @return the first name of the student
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     *
     * @return the last name of the student
     */
    public String getLastName() {
        return lastName;
    }

    /**
     *
     * @return the id of the student
     */
    public Long getId() {
        return id;
    }

    /**
     *
     * @return the PronounsType of the student
     */
    public PronounsType getPronounsType() {
        return pronounsType;
    }

    /**
     *
     * @return the CallnameType of the student
     */
    public CallnameType getCallnameType() {
        return callnameType;
    }

    /**
     *
     * @return the pronouns of the student
     */
    public List<String> getPronouns() {
        return pronouns;
    }

    /**
     *
     * @return the callname of the student
     */
    public String getCallname() {
        return callname;
    }
}
