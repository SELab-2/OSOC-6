package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * This is a simple class that defines a repository for Project,
 * this is needed for the database.
 *
 * @author ruben
 */
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
