package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.validation.ValidationGroups;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashSet;
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
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.EMAIL_LENGTH)
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{email.notempty}")
    @Email(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{email.valid}")
    private String email;

    /**
     * The first name of the user.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.FIRST_NAME_LENGTH)
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{firstname.notempty}")
    private String firstName;

    /**
     * The last name of the user.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.LAST_NAME_LENGTH)
    @NotBlank(groups = ValidationGroups.UserUpdateProfileGroup.class, message = "{lastname.notempty}")
    private String lastName;

    /**
     * Role/ power this user has.
     */
    @NotNull(groups = ValidationGroups.UserUpdateRoleGroup.class, message = "{userrole.valid}")
    @Basic(optional = false)
    private UserRole userRole;

    /**
     * {@link Set} of {@link Invitation} that was sent out by the user.
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
     * Set of skills a user has.
     */
    @OneToMany(orphanRemoval = true)
    private Set<Skill> skills;

    /**
     * User's default no-args constructor.
     */
    public User() { }

    /**
     *
     * @param newEmail the email of the user
     * @param newFirstName the first name of the user
     * @param newLastName the last name of the user
     * @param newUserRole the role of the user
     */
    public User(final String newEmail, final String newFirstName,
                final String newLastName, final UserRole newUserRole) {
        email = newEmail;
        firstName = newFirstName;
        lastName = newLastName;
        userRole = newUserRole;
        sendInvitations = new HashSet<>();
        receivedInvitations = new HashSet<>();
        communications = new ArrayList<>();
        skills = new HashSet<>();
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
     * @return Invitations sent by the user
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
     * @return the Set of skills this user has
     */
    public Set<Skill> getSkills() {
        return skills;
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
