package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostFilter;

import java.util.List;

/**
 * This is a simple class that defines a repository for Organisation.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 *
 * @author lvrossem
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.ORGANISATIONS_PATH,
        path = DumbledorePathWizard.ORGANISATIONS_PATH)
public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
    /**
     * Find an organisation by its name.
     * @param name the name of the searched organisation
     * @return list of matched organisations
     */
//    @PostFilter("filterObject.project.edition == 53553")
    List<Organisation> findByName(@Param("name") String name);
}
