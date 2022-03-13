package com.osoc6.OSOC6.database.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import java.util.List;
import java.util.Set;

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
     * Role/ power this user has.
     */
    private UserRole userRole;

    /**
     * {@link Set} of {@link Invitation} that was send out by the user.
     * A user can only create invitations if it has the {@link UserRole} admin.
     */
    @OneToMany(mappedBy = "issuer", orphanRemoval = true)
    private Set<Invitation> sendInvitations;

    /**
     * The {@link Invitation} that allowed the user to participate in an {@link Edition}.
     */
    @OneToMany(mappedBy = "subject", orphanRemoval = false)
    private Set<Invitation> receivedInvitations;

    /**
     * List of communications this user initiated ordered on the timestamp of the {@link Communication}.
     */
    @OneToMany(mappedBy = "user", orphanRemoval = true)
    @OrderColumn(name = "timestamp")
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
     * @return Invitations send by the user
     */
    public Set<Invitation> getSendInvitations() {
        return sendInvitations;
    }

    /**
     *
     * @return Invitations received by the user
     */
    public Set<Invitation> getReceivedInvitations() {
        return receivedInvitations;
    }

    /**
     *
     * @return communication initiated by the user
     */
    public List<Communication> getCommunications() {
        return communications;
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
