package com.osoc6.OSOC6.assembler;

import com.osoc6.OSOC6.controller.SkillTypeController;
import com.osoc6.OSOC6.database.models.SkillType;
import lombok.NonNull;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

/**
 * Assembler component used to make API more restfull.
 * This assembler is used for the {@link SkillType} endpoints.
 */
@Component
public class SkillTypeModelAssembler implements RepresentationModelAssembler<SkillType, EntityModel<SkillType>> {

    /**
     * Mainly used to make API more restfull
     * in the JSON, _links will be added which point
     * to yourself and all skillTypes.
     * @param skillType the requested skillType
     * @return the more restfull representation of the requested skillType entity
     */
    @Override
    @NonNull
    public EntityModel<SkillType> toModel(@NonNull final SkillType skillType) {
        return EntityModel.of(skillType, //
                linkTo(methodOn(SkillTypeController.class).one(skillType.getName())).withSelfRel(),
                linkTo(methodOn(SkillTypeController.class).all()).withRel("skillTypes"));
    }
}
