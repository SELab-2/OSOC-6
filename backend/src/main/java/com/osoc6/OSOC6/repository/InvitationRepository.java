package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link Invitation},
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.INVITATION_PATH,
        path = DumbledorePathWizard.INVITATION_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
}
