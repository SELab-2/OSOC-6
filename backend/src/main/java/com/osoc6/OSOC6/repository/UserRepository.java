package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
 * It accepts requests and sends answers in a RESTful way.
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
     * Count how many enabled user with the specified role there are.
     * This is needed for role patch safety.
     * @param userRole the role of the users to look for
     * @param enabled whether the user is enabled or not
     * @return how many users there exist  with the specified role that are enabled or not.
     */
    int countAllByUserRoleEqualsAndEnabled(@Param("userRole") UserRole userRole, @Param("enabled") Boolean enabled);

    /**
     * Update a {@link UserEntity}.
     * @apiNote
     * An admin can update everything about every user, except for their own role when they are the last admin.
     * A coach can only update themselves and cannot change their role.
     */
    @Override
    @PreAuthorize("( " + MerlinSpELWizard.ADMIN_AUTH + " and "
    + "(@userRepository.countAllByUserRoleEqualsAndEnabled(T(com.osoc6.OSOC6.database.models.UserRole).ADMIN, true) > 1"
        + " or #userEntity.id == null" // new user check
        + " or authentication.principal.id != #userEntity.id " // updating a different user than yourself
        + " or authentication.principal.userRole == #userEntity.userRole))" // don't update your own role
    + " or (authentication.principal.id == #userEntity.id " // coach is updating themselves
        + " and authentication.principal.userRole == #userEntity.userRole)") // user is not updating his own role
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

    /**
     * Find a user by its edition.
     * @param edition the edition the user search is restricted to
     * @param pageable argument needed to return a page
     * @return page of matching users
     */
    @RestResource(path = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH,
            rel = DumbledorePathWizard.FIND_ANYTHING_BY_EDITION_PATH)
    @PreAuthorize(MerlinSpELWizard.USER_CAN_QUERY_EDITION)
    @Query(value =
        "SELECT DISTINCT ON (u.id) u.* FROM users u LEFT JOIN invitation i ON u.id = i.subject_id "
            + "WHERE :edition IS NOT NULL and (u.user_role = 'ADMIN' or "
            + "i.edition_id = :#{@spelUtil.safeLong(#edition)})", nativeQuery = true)
    Page<UserEntity> findByEdition(@Param("edition") Long edition, Pageable pageable);
}
