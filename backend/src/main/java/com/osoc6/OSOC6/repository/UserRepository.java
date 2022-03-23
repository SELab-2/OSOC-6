package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link UserEntity}.
 * It exposes basic CRUD operations on the {@link UserEntity}.
 * It accepts requests and sends answers in a REST-full way.
 */
@Repository
@Transactional(readOnly = true)
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.USERS_PATH,
        path = DumbledorePathWizard.USERS_PATH)
@PreAuthorize("hasRole('ADMIN')")
public interface UserRepository  extends JpaRepository<UserEntity, Long> {
    /**
     * This method finds the user with a given email address.
     * @param email email address of the searched user
     * @return if there is an account for the given email, the user will be returned
     */
    Optional<UserEntity> findByEmail(String email);
}
