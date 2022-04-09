package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for Invitation.
 * This creates default restful endpoints and allows us to access the database in a restful manner.
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.INVITATIONS_PATH,
        path = DumbledorePathWizard.INVITATIONS_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    /**
     * Search by using the following: /{DumbledorePathWizard.INVITATIONS_PATH}/search/findByToken?token=tokenString.
     * @param token the token of the invitation
     * @return found invitation
     * @apiNote We need to add permitAll here because an unauthenticated user needs to be able to register.
     * In order to register they need to have a valid invitation token and thus need to be able to query by it.
     */
    @PreAuthorize("permitAll()")
    Optional<Invitation> findByToken(@Param("token") String token);
}
