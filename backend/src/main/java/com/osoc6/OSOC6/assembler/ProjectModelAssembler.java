package com.osoc6.OSOC6.assembler;

import com.osoc6.OSOC6.controller.ProjectController;
import com.osoc6.OSOC6.database.models.Project;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Component
public class ProjectModelAssembler implements RepresentationModelAssembler<Project, EntityModel<Project>> {

    /**
     * Mainly used to make API more restfull
     * in the JSON, _links will be added which point
     * to yourself and all projects.
     * @param project the requested project
     * @return the more restfull representation of the requested project entity
     */
    @Override
    @NonNull
    public EntityModel<Project> toModel(@NonNull final Project project) {
        return EntityModel.of(project, //
                linkTo(methodOn(ProjectController.class).one(project.getId())).withSelfRel(),
                linkTo(methodOn(ProjectController.class).all()).withRel("projects"));
    }
}
