package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.ProjectModelAssembler;
import com.osoc6.OSOC6.exception.ProjectNotFoundException;
import com.osoc6.OSOC6.model.Project;
import com.osoc6.OSOC6.repository.ProjectRepository;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Here all endpoints are configured for the Project.
 *
 * @author ruben
 */
@RestController
public class ProjectController {

    private final ProjectRepository repository;

    private final ProjectModelAssembler assembler;

    ProjectController(ProjectRepository repository, ProjectModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    @GetMapping("/projects")
    public CollectionModel<EntityModel<Project>> all() {
        List<EntityModel<Project>> projects = repository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(projects, linkTo(methodOn(ProjectController.class).all()).withSelfRel());
    }

    @PostMapping("/projects")
    public Project newProject(@RequestBody Project newProject) {
        return repository.save(newProject);
    }

    @GetMapping("/projects/{id}")
    public EntityModel<Project> one(@PathVariable Long id) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));

        return assembler.toModel(project);

    }

}
