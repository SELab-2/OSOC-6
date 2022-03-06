package com.osoc6.OSOC6.controller;

import com.osoc6.OSOC6.exception.ProjectNotFoundException;
import com.osoc6.OSOC6.model.Project;
import com.osoc6.OSOC6.repository.ProjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Here all endpoints are configured for the Project.
 *
 * @author ruben
 */
@RestController
public class ProjectController {

    private final ProjectRepository repository;

    ProjectController(ProjectRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/projects")
    public List<Project> all() {
        return repository.findAll();
    }

    @PostMapping("/projects")
    public Project newEmployee(@RequestBody Project newProject) {
        return repository.save(newProject);
    }

    @GetMapping("/projects/{id}")
    public Project one(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ProjectNotFoundException(id));
    }

}
