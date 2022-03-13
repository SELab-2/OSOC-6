package com.osoc6.OSOC6.database.models;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;
import java.util.Set;

/*
Possible annotations:
@NotNull
@Lob
@Column
@Temporal
@JoinTable
@NaturalId
@Size
@Transient
@Query
 */

@Entity
@Table(name = "users")
public class User {

    /**
     * The id of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The email of the user.
     */
    @Basic
    private String email;

    /**
     * The first name of the user.
     */
    @Basic
    private String firstName;

    /**
     * The last name of the user.
     */
    @Basic
    private String lastName;

    /**
     * Role/ power this user has.
     */
    @Basic
    private UserRole userRole;

    // TODO: think about cascade! + How do we say this is reverse of issuer?
    @OneToMany(mappedBy = "issuer", orphanRemoval = true)
    private Set<Invitation> sendInvitations;

    // TODO: required field!
    @OneToMany(mappedBy = "subject")
    private Set<Invitation> receivedInvitations;

    /**
     * TODO: sorted list
     * @return
     */
    @OneToMany(mappedBy = "user")
    private List<Communication> communications;

    /**
     *
     * @return the email of the user
     */
    public String getEmail() {
        return email;
    }

    /**
     *
     * @return The first name of the user
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     *
     * @return The last name of the user
     */
    public String getLastName() {
        return lastName;
    }

    /**
     *
     * @return Role/ power this user has
     */
    public UserRole getUserRole() {
        return userRole;
    }

    /**
     *
     * @param newEmail email address of the user
     */
    public void setEmail(final String newEmail) {
        email = newEmail;
    }

    /**
     *
     * @param newFirstName first name of the user
     */
    public void setFirstName(final String newFirstName) {
        firstName = newFirstName;
    }

    /**
     *
     * @param newLastName last name of the user
     */
    public void setLastName(final String newLastName) {
        lastName = newLastName;
    }

    /**
     *
     * @param newUserRole new roll/ privileges a user has
     */
    public void setUserRole(final UserRole newUserRole) {
        userRole = newUserRole;
    }
}
