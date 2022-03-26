package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link UserEntity}.
 * It exposes basic CRUD operations on the {@link UserEntity}.
 * It accepts requests and sends answers in a REST-full way.
 */
@Repository
//@Transactional(readOnly = true)
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.USERS_PATH,
        path = DumbledorePathWizard.USERS_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface UserRepository  extends JpaRepository<UserEntity, Long> {
    /**
     * This method finds the user with a given email address.
     * @param email email address of the searched user
     * @return if there is an account for the given email, the user will be returned
     */
    Optional<UserEntity> findByEmail(String email);


    /**
     * Try to find a {@link UserEntity} by their id.
     * @apiNote
     * An admin can find any user by their id.
     * A coach can only find themselves.
     */
    @Override
    @PreAuthorize("hasAuthority('ADMIN') or authentication.principal.id == #id")
    @NonNull
    Optional<UserEntity> findById(@NonNull Long id);

    /**
     * Update a {@link UserEntity}.
     * @apiNote
     * An admin can update everything about every user.
     * A coach can only update themselves and cannot change their role.
     */
    @Override
    @PreAuthorize("hasAuthority('ADMIN') or (authentication.principal.id == #userEntity.id "
            + "and authentication.principal.userRole == #userEntity.userRole)")
    @NonNull
    <S extends UserEntity> S save(@NonNull S userEntity);
}
