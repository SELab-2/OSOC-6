package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for Invitation.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.INVITATIONS_PATH,
        path = DumbledorePathWizard.INVITATIONS_PATH)
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

}
