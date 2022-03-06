package com.osoc6.OSOC6.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.osoc6.OSOC6.controller.ProjectController;
import com.osoc6.OSOC6.model.Project;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

@Component
public class ProjectModelAssembler implements RepresentationModelAssembler<Project, EntityModel<Project>> {

    @Override
    @NonNull
    public EntityModel<Project> toModel(@NonNull Project project) {
        return EntityModel.of(project, //
                linkTo(methodOn(ProjectController.class).one(project.getId())).withSelfRel(),
                linkTo(methodOn(ProjectController.class).all()).withRel("projects"));
    }
}