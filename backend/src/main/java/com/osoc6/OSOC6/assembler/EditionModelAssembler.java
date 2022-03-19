package com.osoc6.OSOC6.assembler;

import com.osoc6.OSOC6.controller.EditionController;
import com.osoc6.OSOC6.database.models.Edition;
import lombok.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class EditionModelAssembler implements RepresentationModelAssembler<Edition, EntityModel<Edition>> {

    /**
     * Mainly used to make API more restfull
     * in the JSON, _links will be added which point
     * to yourself and all editions.
     * @param edition the requested edition
     * @return the more restfull representation of the requested edition entity
     */
    @Override
    @NonNull
    public EntityModel<Edition> toModel(@NonNull final Edition edition) {
        return EntityModel.of(edition, //
                linkTo(methodOn(EditionController.class).one(edition.getName())).withSelfRel(),
                linkTo(methodOn(EditionController.class).all()).withRel("editions"));
    }
}
