package com.osoc6.OSOC6.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * This encoder is used to encode the passwords for the users.
 */
@Configuration
public class PasswordEncoder {

    /**
     * This function creates a bean for encoding passwords.
     * @return an encoder for passwords
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
