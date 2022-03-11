package com.osoc6.OSOC6.assembler;

import com.osoc6.OSOC6.controller.OrganisationController;
import com.osoc6.OSOC6.database.models.Organisation;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class OrganisationModelAssembler
        implements RepresentationModelAssembler<Organisation, EntityModel<Organisation>> {

    /**
     * Mainly used to make API more restfull
     * in the JSON, _links will be added which point
     * to yourself and all projects.
     * @param organisation the requested organisation
     * @return the more restfull representation of the requested organisation entity
     */
    @Override
    @NonNull
    public EntityModel<Organisation> toModel(@NonNull final Organisation organisation) {
        return EntityModel.of(organisation, //
                linkTo(methodOn(OrganisationController.class).one(organisation.getId())).withSelfRel(),
                linkTo(methodOn(OrganisationController.class).all()).withRel("projects"));
    }
}
