package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.User;
import com.osoc6.OSOC6.dto.UserProfileDTO;
import com.osoc6.OSOC6.dto.UserRoleDTO;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    /**
     * The user repository, link to the database.
     */
    private final UserRepository userRepository;

    UserService(final UserRepository repository) {
        userRepository = repository;
    }

    /**
     * Get the list of all users.
     * @return list of users
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.findAll());
    }

    /**
     * Get the user corresponding to the provided id.
     * @param id id of the user to find
     * @return the user corresponding to the provided id
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public User getUser(final Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
     * Update the role of a user corresponding to the provided id.
     * @param userRoleDTO contains the new role of the user
     * @param id id of the user to update
     * @return the updated user
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    public User updateUserRole(final UserRoleDTO userRoleDTO, final Long id) {
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
    public User updateUserProfile(final UserProfileDTO userProfileDTO, final Long id) {

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
