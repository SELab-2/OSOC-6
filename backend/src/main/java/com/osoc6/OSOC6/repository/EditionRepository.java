package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for {@link Edition},
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.EDITIONS_PATH,
        path = DumbledorePathWizard.EDITIONS_PATH)
public interface EditionRepository extends JpaRepository<Edition, Long> {
    /**
     * search by using the following: /{DumbledorePathWizard.EDITIONS_PATH}/search/findByName?name=nameOfEdition.
     * @param name the searched name
     * @param pageable argument needed to return a page
     * @return list of matched editions
     */
    Page<Edition> findByName(@Param("name") String name, Pageable pageable);
}
