package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/**
 * This is a simple class that defines a repository for Project.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 *
 * @author lvrossem
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.PROJECTS_PATH,
        path = DumbledorePathWizard.PROJECTS_PATH)
public interface ProjectRepository extends JpaRepository<Project, Long> {
    /**
     * Find a project by its name.
     * @param name the name of the searched project
     * @return list of matched projects
     */
    List<Project> findByName(@Param("name") String name);
}
