package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.exception.AccountTakenException;
import com.osoc6.OSOC6.repository.PublicRepository;
import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;
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
     * The public repository, used to access the database without authorization.
     */
    private final PublicRepository publicRepository;

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
        return publicRepository.internalFindByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(MeguminExceptionWizard.USERNAME_NOT_FOUND_EXCEPTION, email)));
    }

    /**
     * Register a new user.
     * @param userEntity the user that needs to be added to the database.
     * @param invitation the invitation that was used to register
     */
    public void registerUserWithInvitation(final UserEntity userEntity, final Invitation invitation) {
        boolean accountExists = publicRepository.internalFindByEmail(userEntity.getEmail()).isPresent();

        if (accountExists) {
            throw new AccountTakenException(userEntity.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(userEntity.getPassword());
        userEntity.setPassword(encodedPassword);

        publicRepository.internalSave(userEntity);
        invitation.setSubject(userEntity);
        publicRepository.internalSave(invitation);
    }
}
