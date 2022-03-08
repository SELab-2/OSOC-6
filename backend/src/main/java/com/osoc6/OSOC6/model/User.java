package com.osoc6.OSOC6.model;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
public class User {
    /**
     * Unique id of the user.
     */
    @Id
    @GeneratedValue
    private Long id;
    /**
     * Email of the user.
     */
    private String email;
    /**
     * Name of the user.
     */
    private String name;
    /**
     * Role of the user.
     */
    @Enumerated(EnumType.ORDINAL)
    private Role role;

    /**
     * @param newId the new id of the user.
     */
    public void setId(final Long newId) {
        this.id = newId;
    }

    /**
     * @return the id of the user.
     */
    public Long getId() {
        return id;
    }

    /**
     * @return the email of the user.
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param newEmail the new email of the user.
     */
    public void setEmail(final String newEmail) {
        this.email = newEmail;
    }

    /**
     * @param newName the new name of the user.
     */
    public void setName(final String newName) {
        this.name = newName;
    }

    /**
     * @return the name of the user.
     */
    public String getName() {
        return name;
    }

    /**
     * @return the role of the user.
     */
    public Role getRole() {
        return role;
    }

    /**
     * @param newRole the new role of the user.
     */
    public void setRole(final Role newRole) {
        this.role = newRole;
    }
}
