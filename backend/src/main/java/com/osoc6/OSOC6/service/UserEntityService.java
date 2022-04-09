package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.exception.AccountTakenException;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * This service handles user functionalities such as finding and registering a user.
 */
@Service
@AllArgsConstructor
public class UserEntityService implements UserDetailsService {

    /**
     * The user repository, link to the database.
     */
    private final UserRepository userRepository;

    /**
     * The invitation repository, link to the database.
     */
    private final InvitationRepository invitationRepository;

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
        //REMOVE remove this manual security manipulation!!!!!
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new UsernamePasswordAuthenticationToken(null, null, List.of(new SimpleGrantedAuthority("ADMIN"))));
        SecurityContextHolder.setContext(securityContext);

        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(MeguminExceptionWizard.USERNAME_NOT_FOUND_EXCEPTION, email)));

        //REMOVE remove this manual security manipulation!!!!!
        SecurityContextHolder.clearContext();

        return userEntity;
    }

    /**
     * Register a new user.
     * @param userEntity the user that needs to be added to the database.
     * @param invitation the invitation that was used to register
     */
    public void registerUserWithInvitation(final UserEntity userEntity, final Invitation invitation) {
        //REMOVE remove this manual security manipulation!!!!!
        SecurityContext securityContext = new SecurityContextImpl();
        securityContext.setAuthentication(
                new UsernamePasswordAuthenticationToken(null, null, List.of(new SimpleGrantedAuthority("ADMIN"))));
        SecurityContextHolder.setContext(securityContext);

        boolean accountExists = userRepository.findByEmail(userEntity.getEmail()).isPresent();

        if (accountExists) {
            throw new AccountTakenException(userEntity.getEmail());
        }

        String encodedPassword = passwordEncoder.encode(userEntity.getPassword());
        userEntity.setPassword(encodedPassword);

        userRepository.save(userEntity);
        invitation.setSubject(userEntity);
        invitationRepository.save(invitation);

        //REMOVE remove this manual security manipulation!!!!!
        SecurityContextHolder.clearContext();
    }
}
