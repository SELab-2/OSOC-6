package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
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
@PreAuthorize("hasAuthority('ADMIN')")
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Override @NonNull
    @PostAuthorize("!returnObject.present or hasAuthority('ADMIN') or "
            + "@authorizationUtil.userEditions(authentication.principal).contains(returnObject.get.edition.id)")
    Optional<Project> findById(@NonNull Long aLong);

    @Override @NonNull
    @Query("SELECT p from Project p where :#{hasAuthority('ADMIN')} = true or "
            + "p.edition.id in :#{@authorizationUtil.userEditions(authentication.principal)}")
    Page<Project> findAll(@NonNull Pageable pageable);
}
