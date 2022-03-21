package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Edition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/**
 * This is a simple class that defines a repository for Project,
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = "editions", path = "editions")
public interface EditionRepository extends JpaRepository<Edition, Long> {
    /**
     * search by using the following: /editions/search/findByName?name=nameOfEdition.
     * @param name the searched name
     * @return list of matched editions
     */
    List<Edition> findByName(@Param("name") String name);
}
