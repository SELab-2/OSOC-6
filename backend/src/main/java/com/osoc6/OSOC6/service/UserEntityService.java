package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.dto.UserProfileDTO;
import com.osoc6.OSOC6.dto.UserRoleDTO;
import com.osoc6.OSOC6.exception.AccountTakenException;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

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

    /**
     * Get the list of all users.
     * @return list of users
     */
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get a set of all skills of a user.
     * @param id id of the user
     * @return set of the skills of the user
     */
    public Set<Skill> getUserSkills(final Long id) {
        return userRepository.findById(id)
                .map(UserEntity::getSkills)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Get the user corresponding to the provided id.
     * @param id id of the user to find
     * @return the user corresponding to the provided id
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public UserEntity getUser(final Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Update the role of a user corresponding to the provided id.
     * @param userRoleDTO contains the new role of the user
     * @param id id of the user to update
     * @return the updated user
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public UserEntity updateUserRole(final UserRoleDTO userRoleDTO, final Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setUserRole(userRoleDTO.getUserRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Update the profile (email, firstName, lastName, skills) of a user corresponding to the provided id.
     * @param userProfileDTO DTO containing the updated fields
     * @param id id of the user to update
     * @return the updated user
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public UserEntity updateUserProfile(final UserProfileDTO userProfileDTO, final Long id) {

        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(userProfileDTO.getEmail());
                    user.setFirstName(userProfileDTO.getFirstName());
                    user.setLastName(userProfileDTO.getLastName());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Delete the user corresponding to the provided id.
     * @param id id of the user to delete
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public void deleteUser(final Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new UserNotFoundException(id);
        }
    }
}
