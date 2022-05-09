package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.entities.Project;
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
 * This is a simple class that defines a repository for Project.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 *
 * @author lvrossem
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.PROJECTS_PATH,
        path = DumbledorePathWizard.PROJECTS_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Project> findById(@NonNull Long id);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("SELECT p from Project p where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or p.edition.id in "
            + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<Project> findAll(@NonNull Pageable pageable);

    /**
     * Get all projects within an edition.
     * @param editionId the id of the edition you want to see the projects of
     * @param pageable argument needed to return a page
     * @return page of matching projects
     */
    @RestResource(path = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH,
            rel = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH)
    @PreAuthorize(MerlinSpELWizard.USER_CAN_QUERY_EDITION)
    @Query("select p from Project p where p.edition.id = :edition")
    Page<Project> findByEdition(@Param("edition") Long editionId, @NonNull Pageable pageable);
}
