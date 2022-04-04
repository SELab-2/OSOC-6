package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Assignment;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link Assignment},
 * this is needed for the database.
 * Coaches don't get access to this resource since they are unable to track communication from within the tool.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.ASSIGNMENT_PATH,
        path = DumbledorePathWizard.ASSIGNMENT_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
}
