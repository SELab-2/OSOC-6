package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

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
     * @param pageable the pageable telling what page to get
     * @return list of matched organisations
     */
    @PreAuthorize("hasAnyAuthority('COACH')")
    @Query("SELECT o from Organisation o where (:#{@hasAuthority('ADMIN')} = true or o.project is null "
            + "or o.project.edition.id in :#{@authorizationUtil.userEditions(authentication.principal)}) "
            + "and o.name like :name")
    Page<Organisation> findByName(@Param("name") String name, Pageable pageable);

    @Override
    @PostAuthorize("!returnObject.present or returnObject.get.project == null or "
            + "@authorizationUtil.userEditions(authentication.principal).contains(returnObject.get.project.edition.id)")
    @NonNull
    Optional<Organisation> findById(@NonNull Long id);

    @Override
    @Query("SELECT o from Organisation o where :#{@hasAuthority('ADMIN')} = true or o.project is null "
            + "or o.project.edition.id in :#{@authorizationUtil.userEditions(authentication.principal)}")
    @NonNull
    Page<Organisation> findAll(@NonNull Pageable pageable);
}
