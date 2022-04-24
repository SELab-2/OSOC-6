package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
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
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface EditionRepository extends JpaRepository<Edition, Long> {
    /**
     * Search by using the following: /{EDITIONS_PATH}/search/{EDITIONS_BY_NAME_PATH}?name=nameOfEdition.
     * @param name the searched name
     * @param pageable argument needed to return a page
     * @return list of matched editions
     */
    @RestResource(path = DumbledorePathWizard.EDITIONS_BY_NAME_PATH,
            rel = DumbledorePathWizard.EDITIONS_BY_NAME_PATH)
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select e from Edition e where e.name LIKE concat(:name, '%') and (" + MerlinSpELWizard.Q_ADMIN_AUTH + " or "
            + "e.id in " + MerlinSpELWizard.Q_USER_EDITIONS + ")")
    Page<Edition> findByName(@Param("name") String name, Pageable pageable);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Edition> findById(@NonNull Long aLong);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("SELECT e from Edition e where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or "
            + "e.id in " + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Edition> findAll(@NonNull Pageable pageable);
}
