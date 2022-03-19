package com.osoc6.OSOC6.assembler;

import com.osoc6.OSOC6.controller.UserController;
import com.osoc6.OSOC6.database.models.User;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class UserModelAssembler implements RepresentationModelAssembler<User, EntityModel<User>> {
    /**
     * @param user the user to place in the EntityModel.
     * @return an EntityModel containing the user and relevant links.
     */
    @Override
    @NonNull
    public EntityModel<User> toModel(final @NonNull User user) {
        return EntityModel.of(user,
                linkTo(methodOn(UserController.class).
                        one(user.getId())).withSelfRel(),
                linkTo(methodOn(UserController.class).
                        all()).withRel("users"));
    }
}