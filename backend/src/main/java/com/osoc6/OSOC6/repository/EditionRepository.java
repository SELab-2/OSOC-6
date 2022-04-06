package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Edition;
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
 * This is a simple class that defines a repository for {@link Edition},
 * this is needed for the database.
 *
 * @author ruben, jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.EDITIONS_PATH,
        path = DumbledorePathWizard.EDITIONS_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface EditionRepository extends JpaRepository<Edition, Long> {
    /**
     * search by using the following: /{DumbledorePathWizard.EDITIONS_PATH}/search/findByName?name=nameOfEdition.
     * @param name the searched name
     * @param pageable argument needed to return a page
     * @return list of matched editions
     */
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @Query("select e from Edition e where e.name = :name and (:#{hasAuthority('ADMIN')} = true or "
            + "e.id in :#{@authorizationUtil.userEditions(authentication.principal)})")
    Page<Edition> findByName(@Param("name") String name, Pageable pageable);

    @Override @NonNull
    @PreAuthorize("hasAuthority('COACH')")
    @PostAuthorize("hasAuthority('ADMIN') or "
            + "@authorizationUtil.hasEditionAccess(authentication.principal, returnObject.get.id)")
    Optional<Edition> findById(Long aLong);

    @Override @NonNull
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    @Query("SELECT e from Edition e where :#{hasAuthority('ADMIN')} = true or "
            + "e.id in :#{@authorizationUtil.userEditions(authentication.principal)}")
    Page<Edition> findAll(Pageable pageable);
}
