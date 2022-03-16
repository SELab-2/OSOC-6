package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(length = RadagastNumberWizard.EMAIL_LENGTH)
    @Getter @Setter
    private String email;

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
    @Getter @Setter
    private UserRole userRole;

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
}
