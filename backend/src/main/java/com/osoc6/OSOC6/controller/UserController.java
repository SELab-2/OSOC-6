package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.UserModelAssembler;
import com.osoc6.OSOC6.database.models.User;
import com.osoc6.OSOC6.dto.UserProfileDTO;
import com.osoc6.OSOC6.dto.UserRoleDTO;
import com.osoc6.OSOC6.service.UserService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class UserController {

    /**
     * The service used to handle the database access.
     */
    private final UserService userService;
    /**
     * The user model assembler.
     */
    private final UserModelAssembler userModelAssembler;

    UserController(final UserService service, final UserModelAssembler modelAssembler) {
        userService = service;
        userModelAssembler = modelAssembler;
    }

    /**
     * Get the list of all users.
     * @return list of entity models of all users
     */
    @GetMapping("/users")
    public CollectionModel<EntityModel<User>> all() {
        List<EntityModel<User>> users = userService.getAllUsers().stream()
                .map(userModelAssembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(users,
                linkTo(methodOn(UserController.class).all()).withSelfRel());
    }

    /**
     * Get the user corresponding to the provided id.
     * @param id id of the user to find
     * @return entity model of the user corresponding to the provided id
     */
    @GetMapping("/users/{id}")
    public EntityModel<User> one(@PathVariable final Long id) {
        User user = userService.getUser(id);
        return userModelAssembler.toModel(user);
    }

    /**
     * Update the role of a user corresponding to the provided id.
     * @param userRoleDTO contains the new role of the user
     * @param id id of the user to update
     * @return response entity containing an entity model with the updated user
     */
    @PatchMapping("/users/{id}/update-role")
    public ResponseEntity<EntityModel<User>> updateUserRole(@Valid @RequestBody final UserRoleDTO userRoleDTO,
                                                            @PathVariable final Long id) {
        User updatedUser = userService.updateUserRole(userRoleDTO, id);
        return ResponseEntity.ok(userModelAssembler.toModel(updatedUser));
    }

    /**
     * Update the profile (email, firstName, lastName) of a user corresponding to the provided id.
     * @param userProfileDTO DTO containing the updated fields
     * @param id id of the user to update
     * @return response entity containing an entity model with the updated user
     */
    @PatchMapping("/users/{id}/update-profile")
    public ResponseEntity<EntityModel<User>> updateUserProfile(@Valid @RequestBody final UserProfileDTO userProfileDTO,
                                                               @PathVariable final Long id) {
        User updatedUser = userService.updateUserProfile(userProfileDTO, id);
        return ResponseEntity.ok(userModelAssembler.toModel(updatedUser));
    }

    /**
     * Delete the user corresponding to the provided id.
     * @param id id of the user to delete
     * @return an empty response entity
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Object> deleteUser(@PathVariable final Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
