package com.osoc6.OSOC6.database.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * The database entity for a User. This entity contains all non-Spring information we need about a user.
 */
@Entity
@Table(name = "users")
@NoArgsConstructor
public class UserEntity implements UserDetails {

    /**
     * The id of the user.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
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
     * The call name of the user.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String callName;

    /**
     * Role/ power this user has.
     */
    @Basic(optional = false)
    @Enumerated(EnumType.STRING)
    @Getter @Setter
    private UserRole userRole;

    /**
     * Indicates whether the account is locked. Needed to implement UserDetails.
     */
    private final Boolean locked = false;

    /**
     * Indicates whether the account is enabled. Needed to implement UserDetails.
     */
    @Setter
    private Boolean enabled = true;

    /**
     * {@link List} of {@link Invitation} that was sent out by the user.
     * A user can only create invitations if it has the {@link UserRole} admin.
     */
    @OneToMany(mappedBy = "issuer", orphanRemoval = true)
    @Getter
    private List<Invitation> sendInvitations;

    /**
     * The {@link Invitation} that allowed the user to participate in an {@link Edition}.
     */
    @JsonIgnore
    @OneToMany(mappedBy = "subject", orphanRemoval = false, fetch = FetchType.EAGER)
    @Getter
    private List<Invitation> receivedInvitations = new ArrayList<>();

    /**
     * List of communications this user initiated ordered on the timestamp of the {@link Communication}.
     */
    @OneToMany(mappedBy = "sender", orphanRemoval = true)
    @OrderColumn(name = "timestamp")
    @Getter
    private List<Communication> communications;

    /**
     * Set of skills a user has.
     */
    @OneToMany(orphanRemoval = true, mappedBy = "userEntity")
    @Getter
    private List<UserSkill> skills;

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
     * @param newCallName the name of the user
     * @param newUserRole the role of the user
     * @param newPassword the password of the user
     */
    public UserEntity(final String newEmail, final String newCallName, final UserRole newUserRole,
                      final String newPassword) {
        email = newEmail;
        callName = newCallName;
        userRole = newUserRole;
        password = newPassword;
        sendInvitations = new ArrayList<>();
        receivedInvitations = new ArrayList<>();
        communications = new ArrayList<>();
        skills = new ArrayList<>();
        projects = new ArrayList<>();
    }

    /**
     * Needed to implement UserDetail.
     * @return the email of the user to login with email instead of username
     */
    public String getUsername() {
        return email;
    }

    /**
     * Returns the autorities granted to the user. Being the userrole : COACH, ADMIN or DISABLED
     * Needed to implement UserDetails
     * @return autorities
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        SimpleGrantedAuthority authority =
                new SimpleGrantedAuthority(userRole.name());
        return Collections.singletonList(authority);
    }

    /**
     * Indicates whether the user's account has expired. Needed to implement UserDetails.
     * @return boolean
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is locked. Needed to implement UserDetails.
     * @return boolean
     */
    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    /**
     * Indicates whether the user's password has expired. Needed to implement UserDetails.
     * @return boolean
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indicates whether the user's account is enabled. Needed to implement UserDetails.
     * @return boolean
     */
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
