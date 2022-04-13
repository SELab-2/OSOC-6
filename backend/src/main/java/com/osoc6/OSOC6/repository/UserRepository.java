package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link UserEntity}.
 * It exposes basic CRUD operations on the {@link UserEntity}.
 * It accepts requests and sends answers in a REST-full way.
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.USERS_PATH,
        path = DumbledorePathWizard.USERS_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    /**
     * This method finds the user with a given email address.
     * @param email email address of the searched user
     * @return if there is an account for the given email, the user will be returned
     */
    @RestResource(path = DumbledorePathWizard.USERS_BY_EMAIL_PATH,
            rel = DumbledorePathWizard.USERS_BY_EMAIL_PATH)
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !returnObject.present or "
            + "@spelUtil.hasOverlappingEditions(authentication.principal, returnObject.get)")
    Optional<UserEntity> findByEmail(String email);

    /**
     * Try to find a {@link UserEntity} by their id.
     */
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !returnObject.present or "
            + "@spelUtil.hasOverlappingEditions(returnObject.get, authentication.principal)")
    Optional<UserEntity> findById(@NonNull Long id);

    /**
     * Check if there exists an enabled user with the specified role.
     * This is needed for creating the base admin user.
     * @param userRole the role of the users to look for
     * @param enabled whether the user is enabled or not
     * @return a list of all users with the specified role
     * @apiNote This is an internal method, meaning it is not exposed as a RestResource.
     */
    @RestResource(exported = false)
    @Query("select (count(u) > 0) from UserEntity u where u.userRole = :userRole and u.enabled = :enabled")
    boolean existsAllByUserRoleEqualsAndEnabled(
            @Param("userRole") UserRole userRole, @Param("enabled") Boolean enabled);

    /**
     * Update a {@link UserEntity}.
     * @apiNote
     * An admin can update everything about every user.
     * A coach can only update themselves and cannot change their role.
     */
    @Override
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or (authentication.principal.id == #userEntity.id "
            + "and authentication.principal.userRole == #userEntity.userRole)")
    @NonNull
    <S extends UserEntity> S save(@NonNull S userEntity);

    /**
     * Find user that is currently logged in.
     * @return The user currently logged in
     */
    @NonNull
    @RestResource(path = DumbledorePathWizard.OWN_USERS_PATH,
            rel = DumbledorePathWizard.OWN_USERS_PATH)
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @Query("select u from UserEntity u where u.id = :#{authentication.principal.id}")
    UserEntity findSelf();
}
