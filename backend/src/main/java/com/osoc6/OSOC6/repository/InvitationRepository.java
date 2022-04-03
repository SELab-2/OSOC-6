package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.INVITATIONS_PATH,
        path = DumbledorePathWizard.INVITATIONS_PATH)
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

}
