package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

/**
 * This is a simple class that defines a repository for Organisation.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 *
 * @author lvrossem
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.ORGANISATIONS_PATH,
        path = DumbledorePathWizard.ORGANISATIONS_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
    /**
     * Find an organisation by its name.
     * @param name the name of the searched organisation
     * @return list of matched organisations
     */
    @PreAuthorize("hasAnyAuthority('COACH')")
    List<Organisation> findByName(@Param("name") String name);

    @Override
    @NonNull
    @PreAuthorize("hasAnyAuthority('COACH')")
    Optional<Organisation> findById(@NonNull Long aLong);
}
