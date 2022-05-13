package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.entities.Invitation;
import com.osoc6.OSOC6.entities.ResetPasswordToken;
import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.exception.AccountTakenException;
import com.osoc6.OSOC6.exception.InvalidResetPasswordTokenException;
import com.osoc6.OSOC6.mail.EmailService;
import com.osoc6.OSOC6.repository.PublicRepository;
import com.osoc6.OSOC6.repository.ResetPasswordTokenRepository;
import com.osoc6.OSOC6.winterhold.MeguminExceptionWizard;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
     * The repository used to access reset password tokens in the database.
     */
    private final ResetPasswordTokenRepository resetPasswordTokenRepository;

    /**
     * The encoder used to encode the passwords.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * The email service, used to send mails.
     */
    private final EmailService emailService;

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

    /**
     * Create a reset password token for the user with the given email address.
     * @param email the email of the user requesting a password reset
     */
    public void createPasswordResetToken(final String email) {
        Optional<UserEntity> optionalUserEntity = publicRepository.internalFindByEmail(email);
        if (optionalUserEntity.isPresent()) {
            ResetPasswordToken resetPasswordToken = new ResetPasswordToken(optionalUserEntity.get());
            resetPasswordTokenRepository.save(resetPasswordToken);
            emailService.sendResetPasswordMessage(email, resetPasswordToken.getToken());
        }
    }

    /**
     * Check whether the given token corresponds to a valid reset password token entity.
     * @param token the token to check
     * @return whether the corresponding entity exists and is still valid
     */
    public boolean isPasswordResetTokenValid(final String token) {
        Optional<ResetPasswordToken> optionalResetPasswordToken =
                resetPasswordTokenRepository.internalFindByToken(token);
        return optionalResetPasswordToken.isPresent() && optionalResetPasswordToken.get().isValid();
    }

    /**
     * Reset the password of the user linked to the reset password token with the provided token.
     * @param token the token of the reset password token
     * @param newPassword the new password of the user
     */
    public void resetUserPassword(final String token, final String newPassword) {
        Optional<ResetPasswordToken> optionalResetPasswordToken =
                resetPasswordTokenRepository.internalFindByToken(token);
        if (optionalResetPasswordToken.isPresent() && optionalResetPasswordToken.get().isValid()) {
            UserEntity userEntity = optionalResetPasswordToken.get().getSubject();

            String encodedPassword = passwordEncoder.encode(newPassword);
            userEntity.setPassword(encodedPassword);

            publicRepository.internalUpdate(userEntity);

            resetPasswordTokenRepository.delete(optionalResetPasswordToken.get());
        } else {
            throw new InvalidResetPasswordTokenException();
        }
    }
}
