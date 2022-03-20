package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.exception.AccountTakenException;
import com.osoc6.OSOC6.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * This service handles user functionalities such as finding and registering a user.
 */
@Service
@AllArgsConstructor
public class UserEntityService implements UserDetailsService {

    /**
     * Error message for login with unregistered email.
     */
    private final String userNotFoundMsg =
            "user with email %s not found";

    /**
     * The user repository, link to the database.
     */
    private final UserRepository userRepository;

    /**
     * The encoder used to encode the passwords.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     *
     * @param email the email of the user trying to log in
     * @return returns the UserDetails for the user with the given email
     * @throws UsernameNotFoundException exception is thrown when there is no user registered with the given email
     */
    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(userNotFoundMsg, email)));
    }

    /**
     * Register a new user.
     * @param userEntity the user that needs to be added to the database.
     */
    public void registerUser(final UserEntity userEntity) {
        boolean accountExists = userRepository.findByEmail(userEntity.getEmail()).isPresent();

        if (accountExists) {
            throw new AccountTakenException(userEntity.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(userEntity.getPassword());
        userEntity.setPassword(encodedPassword);

        userRepository.save(userEntity);
    }
}
