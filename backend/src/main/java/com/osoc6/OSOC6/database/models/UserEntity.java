package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@NoArgsConstructor
public class UserEntity {

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
    @Column(length = RadagastNumberWizard.EMAIL_LENGTH, unique = true)
    @Getter @Setter
    private String email;

    /**
     * The password of the user.
     */
    @Getter @Setter
    private String password;

    /**
     * The first name of the user.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.FIRST_NAME_LENGTH)
    @Getter @Setter
    private String firstName;

    /**
     * The last name of the user.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.LAST_NAME_LENGTH)
    @Getter @Setter
    private String lastName;

    /**
     * Role/ power this user has.
     */
    @Basic(optional = false)
    @Enumerated(EnumType.STRING)
    @Getter @Setter
    private UserRole userRole;

    private Boolean locked = false;
    // TODO : change when working with confirmation email
    private Boolean enabled = true;

    /**
     * {@link Set} of {@link Invitation} that was sent out by the user.
     * A user can only create invitations if it has the {@link UserRole} admin.
     */
    @OneToMany(mappedBy = "issuer", orphanRemoval = true)
    @Getter
    private Set<Invitation> sendInvitations;

    /**
     * The {@link Invitation} that allowed the user to participate in an {@link Edition}.
     */
    @OneToMany(mappedBy = "subject", orphanRemoval = false)
    @Getter
    private Set<Invitation> receivedInvitations;

    /**
     * List of communications this user initiated ordered on the timestamp of the {@link Communication}.
     */
    @OneToMany(mappedBy = "userEntity", orphanRemoval = true)
    @OrderColumn(name = "timestamp")
    @Getter
    private List<Communication> communications;

    /**
     * Set of skills a user has.
     */
    @OneToMany(orphanRemoval = true)
    @Getter
    private Set<Skill> skills;

    /**
     * The projects this User Coaches.
     */
    @ManyToMany(mappedBy = "coaches")
    @OrderColumn(name = "edition_name")
    @Getter
    private List<Project> projects;

    /**
     *
     * @param newEmail the email of the user
     * @param newFirstName the first name of the user
     * @param newLastName the last name of the user
     * @param newUserRole the role of the user
     */
    public UserEntity(final String newEmail, final String newFirstName,
                final String newLastName, final UserRole newUserRole) {
        email = newEmail;
        firstName = newFirstName;
        lastName = newLastName;
        userRole = newUserRole;
        sendInvitations = new HashSet<>();
        receivedInvitations = new HashSet<>();
        communications = new ArrayList<>();
        skills = new HashSet<>();
        projects = new ArrayList<>();
    }

    /**
     *
     * @return the email of the user
     */
    public String getUsername() {
        return email;
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
     * @return the password of the user
     */
    public String getPassword() {
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

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(userRole.name());
        return Collections.singletonList(authority);
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
     * @param newPassword email address of the user
     */
    public void setPassword(final String newPassword) {
        password = newPassword;
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

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
