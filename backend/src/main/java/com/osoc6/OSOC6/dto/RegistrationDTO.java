package com.osoc6.OSOC6.dto;

import lombok.Data;

import javax.validation.constraints.Email;

/**
 * DTO for registrations containing the information needed to set up a user.
 */
@Data
public class RegistrationDTO {
    /**
     * The first name of the registering user.
     */
    private final String firstName;

    /**
     * The last name of the registering user.
     */
    private final String lastName;

    /**
     * The email address of the registering user.
     */
    @Email(message = "Entered email-address is not valid.")
    private final String email;

    /**
     * The password of the registering user.
     */
    private final String password;
}
