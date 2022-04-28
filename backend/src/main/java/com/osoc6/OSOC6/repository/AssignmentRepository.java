package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link Assignment},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.ASSIGNMENT_PATH,
        path = DumbledorePathWizard.ASSIGNMENT_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Assignment> findById(@NonNull Long assignmentId);

    @Override @NonNull
    // No additional checks are needed because they are solved through the reference chain.
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or authentication.principal.id == #entity.assigner.id")
    <S extends Assignment> S save(@NonNull S entity);

    @Override
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !@assignmentRepository.findById(#assignmentId).present or "
            + "authentication.principal.id == @assignmentRepository.findById(#assignmentId).get.assigner.id")
    void deleteById(@NonNull Long assignmentId);
}
