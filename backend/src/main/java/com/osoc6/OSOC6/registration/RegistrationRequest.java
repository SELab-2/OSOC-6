package com.osoc6.OSOC6.registration;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class RegistrationRequest {
    /**
     * The first name of the registering user.
     */
    @Getter
    private final String firstName;

    /**
     * The last name of the registering user.
     */
    @Getter
    private final String lastName;

    /**
     * The email address of the registering user.
     */
    @Getter
    private final String email;

    /**
     * The password of the registering user.
     */
    @Getter
    private final String password;
}
