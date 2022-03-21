package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.assembler.ProjectModelAssembler;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.service.ProjectService;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ProjectController {

    /**
     * The link to the database.
     */
    private final ProjectService service;

    /**
     * Assembler, used to make the API more restfull.
     */
    private final ProjectModelAssembler assembler;

    /**
     * The constructor for the projectController.
     * @param projectService the link to the database
     * @param projectModelAssembler used to make the API more restfull
     */
    ProjectController(final ProjectService projectService, final ProjectModelAssembler projectModelAssembler) {
        this.service = projectService;
        this.assembler = projectModelAssembler;
    }

    /**
     * Get the list of all projects.
     * @return Collection of all projects
     */
    @GetMapping("/projects")
    public CollectionModel<EntityModel<Project>> all() {
        List<EntityModel<Project>> projects = this.service.getAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(projects, linkTo(methodOn(ProjectController.class).all()).withSelfRel());
    }

    /**
     * Add a new project via a POST.
     * @param newProject The project entity that had to be added to the database
     * @return The newly added project entity
     */
    @PostMapping("/projects")
    public ResponseEntity<EntityModel<Project>> newProject(@Valid @RequestBody final Project newProject) {
        EntityModel<Project> entityModel = assembler.toModel(this.service.createProject(newProject));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()) //
                .body(entityModel);
    }

    /**
     * Get a project by id.
     * @param id The id of the project that needs to be fetched from the database
     * @return The project entity
     */
    @GetMapping("/projects/{id}")
    public EntityModel<Project> one(@PathVariable final Long id) {
        Project project = this.service.get(id);

        return assembler.toModel(project);

    }

    /**
     * Update the project via a PATCH.
     * @param projectUpdate The updated entity
     * @param id The id of the project that needs to be updated
     * @return The new project entity
     */
    @PatchMapping("/projects/{id}")
    public ResponseEntity<EntityModel<Project>> updateProject(@Valid @RequestBody final Project projectUpdate,
                                                              @PathVariable final Long id) {
        Project updatedProject = this.service.updateProject(projectUpdate, id);

        return ResponseEntity.ok(assembler.toModel(updatedProject));
    }

    /**
     * Delete a project via a DELETE.
     * @param id The id of the project that needs to be deleted
     * @return empty response
     */
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Object> deleteProject(@PathVariable final Long id) {
        this.service.deleteProject(id);

        return ResponseEntity.ok("Project is deleted successsfully.");
    }
}
