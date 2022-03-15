package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.UserModelAssembler;
import com.osoc6.OSOC6.database.models.User;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.validation.ValidationGroups;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class UserController {
    /**
     * The user repository.
     */
    private final UserRepository userRepository;
    /**
     * The user model assembler.
     */
    private final UserModelAssembler userModelAssembler;

    UserController(final UserRepository repository, final UserModelAssembler modelAssembler) {
        this.userRepository = repository;
        this.userModelAssembler = modelAssembler;
    }

    /**
     * Get the list of all users.
     * @return list of users
     */
    @GetMapping("/users")
    public CollectionModel<EntityModel<User>> all() {
        List<EntityModel<User>> users = userRepository.findAll().stream()
                .map(userModelAssembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(users,
                linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    /**
     * Get the user corresponding to the provided id.
     * @param id id of the user to find
     * @return the user corresponding to the provided id
     * @throws UserNotFoundException if the user with the provided id does not exist.
     */
    @GetMapping("/users/{id}")
    public EntityModel<User> one(@PathVariable final Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return userModelAssembler.toModel(user);
    }

    /**
     * Update the role of a user corresponding to the provided id.
     * @param roleUser the new role of the user
     * @param id id of the user to update
     * @return the updated user
     */
    @PatchMapping("/users/{id}/update-role")
    public ResponseEntity<EntityModel<User>> updateUserRole(@Validated(ValidationGroups.UserUpdateRoleGroup.class)
                                                                @RequestBody final User roleUser,
                                                            @PathVariable final Long id) {
        User updatedUser = userRepository.findById(id)
                .map(user -> {
                    user.setUserRole(roleUser.getUserRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));

        return ResponseEntity.ok(userModelAssembler.toModel(updatedUser));
    }

    /**
     * Update the profile (email, firstName, lastName) of a user corresponding to the provided id.
     * @param profileUser user object containing the updated fields
     * @param id id of the user to update
     * @return the updated user
     */
    @PatchMapping("/users/{id}/update-profile")
    public ResponseEntity<EntityModel<User>> updateUserProfile(@Validated(ValidationGroups.UserUpdateProfileGroup.class)
                                                                   @RequestBody final User profileUser,
                                                            @PathVariable final Long id) {
        User updatedUser = userRepository.findById(id)
                .map(user -> {
                    user.setEmail(profileUser.getEmail());
                    user.setFirstName(profileUser.getFirstName());
                    user.setLastName(profileUser.getLastName());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));

        return ResponseEntity.ok(userModelAssembler.toModel(updatedUser));
    }

    /**
     * Delete the user corresponding to the provided id.
     * @param id id of the user to delete
     * @return an empty response
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable final Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new UserNotFoundException(id);
        }

        return ResponseEntity.noContent().build();
    }

}
