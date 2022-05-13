package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.entities.ProjectSkill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
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
 * This is a simple class that defines a repository for {@link ProjectSkill},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.PROJECT_SKILL_PATH,
        path = DumbledorePathWizard.PROJECT_SKILL_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, Long> {
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<ProjectSkill> findById(@NonNull Long id);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("SELECT p from ProjectSkill p where " + MerlinSpELWizard.Q_ADMIN_AUTH + " or p.project.edition.id in "
            + MerlinSpELWizard.Q_USER_EDITIONS)
    Page<ProjectSkill> findAll(@NonNull Pageable pageable);
}
