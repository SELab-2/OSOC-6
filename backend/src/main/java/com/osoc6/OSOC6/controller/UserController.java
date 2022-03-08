package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.UserModelAssembler;
import com.osoc6.OSOC6.model.User;
import com.osoc6.OSOC6.exception.UserNotFoundException;
import com.osoc6.OSOC6.repository.UserRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
     * @return list of users.
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
     * @param id id of the user to find.
     * @return the user corresponding to the provided id.
     * @throws UserNotFoundException
     * if the user with the provided id does not exist.
     */
    @GetMapping("/users/{id}")
    public EntityModel<User> one(final @PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return userModelAssembler.toModel(user);
    }

    /**
     * Create a new user.
     * @param newUser the new user to create.
     * @return the newly created user.
     */
    @PostMapping("/users")
    public ResponseEntity<EntityModel<User>> newUser(final @RequestBody User newUser) {
        EntityModel<User> entityModel = userModelAssembler.toModel(userRepository.save(newUser));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    /**
     * Temporary documentation, this method will be refactored into multiple others.
     * @param userUpdate user
     * @param id id
     * @return user
     */
    @PatchMapping("/users/{id}")
    public ResponseEntity<EntityModel<User>> updateUser(final @RequestBody User userUpdate,
                                                        final @PathVariable Long id) {
        User updatedUser = userRepository.findById(id)
                .map(user -> {
                    if (userUpdate.getEmail() != null) {
                        user.setEmail(userUpdate.getEmail());
                    }
                    if (userUpdate.getRole() != null) {
                        user.setRole(userUpdate.getRole());
                    }
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new UserNotFoundException(id));

        return ResponseEntity.ok(userModelAssembler.toModel(updatedUser));
    }

}
