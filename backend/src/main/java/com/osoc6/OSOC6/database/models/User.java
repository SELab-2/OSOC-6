package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.validation.ValidationGroups;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

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
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{email.notempty}")
    @Email(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{email.valid}")
    private String email;

    /**
     * The first name of the user.
     */
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{firstname.notempty}")
    private String firstName;

    /**
     * The last name of the user.
     */
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{lastname.notempty}")
    private String lastName;

    /**
     * Role/ power this user has.
     */
    @NotNull(groups = ValidationGroups.UserUpdateRoleGroup.class, message = "{userrole.valid}")
    private UserRole userRole;

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

    /**
     * @return The id of the user
     */
    public Long getId() {
        return id;
    }
}
