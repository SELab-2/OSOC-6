package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.UserRole;

import javax.validation.constraints.NotNull;

public class UserRoleDTO {

    /**
     * Role of a user.
     */
    @NotNull(message = "{userrole.valid}")
    private UserRole userRole;

    /**
     * @return the user role
     */
    public UserRole getUserRole() {
        return userRole;
    }

    /**
     * @param newUserRole the new user role
     */
    public void setUserRole(final UserRole newUserRole) {
        userRole = newUserRole;
    }
}
