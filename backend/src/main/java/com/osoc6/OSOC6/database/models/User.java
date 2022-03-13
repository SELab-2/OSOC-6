package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

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
    private String email;

    /**
     * The first name of the user.
     */
    private String firstName;

    /**
     * The last name of the user.
     */
    private String lastName;

    /**
     * Role/power this user has.
     */
    private UserRole userRole;

    /**
     * User's default no-arg constructor
     */
    public User() {}

    /**
     *
     * @param email the email of the user
     * @param firstName the first name of the user
     * @param lastName the last name of the user
     * @param userRole the role of the user
     */
    public User(String email, String firstName, String lastName, UserRole userRole) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userRole = userRole;
    }

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
