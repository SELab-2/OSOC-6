package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for {@link Communication},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.COMMUNICATION_PATH,
        path = DumbledorePathWizard.COMMUNICATION_PATH)
public interface CommunicationRepository extends JpaRepository<Communication, Long> {
}
