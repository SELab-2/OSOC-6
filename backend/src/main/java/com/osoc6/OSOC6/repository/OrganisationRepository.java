package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Organisation;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * This is a simple class that defines a repository for Organisation,
 * this is needed for the database.
 *
 * @author ruben
 */
public interface OrganisationRepository extends JpaRepository<Organisation, Long> {
}
