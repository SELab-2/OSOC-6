package com.osoc6.OSOC6.services;

import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.exception.ProjectNotFoundException;
import com.osoc6.OSOC6.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    /**
     * The link to the database.
     */
    private final ProjectRepository repository;

    /**
     * Constructor for the ProjectService, needs a link to database.
     * @param newRepository Connection to database
     */
    public ProjectService(final ProjectRepository newRepository) {
        this.repository = newRepository;
    }

    /**
     * Handle the post request.
     * @param project The project that needs to be added to the database
     * @return added project
     */
    public Project createProject(final Project project) {
        repository.save(project);
        return project;
    }

    /**
     * Handle the delete request.
     * @param id The id of the project that needs to be deleted
     */
    public void deleteProject(final Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new ProjectNotFoundException(id);
        }
    }

    /**
     * Handle the get request on /projects.
     * @return List with all projects
     */
    public List<Project> getAll() {
        return repository.findAll();
    }

    /**
     * Handle the get request.
     * @param id The id of the project that needs to be fetched
     * @return the requested project
     */
    public Project get(final Long id) {
        return repository.findById(id).orElseThrow(() -> new ProjectNotFoundException(id));
    }

    /**
     * Handle the patch request.
     * @param projectUpdate The project with what /projects/id needs to be replaced with
     * @param id The id of the project that needs to be replaced
     * @return the new project
     */
    public Project updateProject(final Project projectUpdate, final Long id) {
        return repository.findById(id)
                .map(project -> {
                    project.setName(projectUpdate.getName());
                    project.setGoals(projectUpdate.getGoals());

                    return repository.save(project);
                })
                .orElseThrow(() -> new ProjectNotFoundException(id));
    }
}
