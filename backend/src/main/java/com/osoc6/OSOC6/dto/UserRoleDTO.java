package com.osoc6.OSOC6.dto;

import com.osoc6.OSOC6.database.models.UserRole;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class UserRoleDTO {

    /**
     * Role of a user.
     */
    @NotNull(message = "{userrole.valid}")
    private UserRole userRole;
}
