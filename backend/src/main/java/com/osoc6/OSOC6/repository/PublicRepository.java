package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.List;
import java.util.Optional;

/**
 * This is our custom repository. Its methods are not exposed and are not secured with authorization.
 * The methods are only accessible by manually calling this repository from within the application.
 * They are callable from everywhere in the application, even if the user sending a request is unauthenticated.
 * This means that this repository should only be used when you are sure there is no way of using a normal repository,
 * and if you know what you are doing.
 */
@Repository
public class PublicRepository {

    /**
     * The entity manager, used to interact with the persistence context.
     */
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * This method finds the user with a given email address.
     * @param email email address of the searched user
     * @return if there is an account for the given email, the user will be returned
     * @apiNote Since we are casting to Optional, we need to add the 'unchecked' suppress warnings annotation
     */
    @SuppressWarnings("unchecked")
    public Optional<UserEntity> internalFindByEmail(final String email) {
        Query query = entityManager.createQuery("select u from UserEntity u where u.email = :email");
        query.setParameter("email", email);
        List<?> results = query.getResultList();
        return (Optional<UserEntity>) results.stream().findFirst();
    }

    /**
     * Check if there exists an enabled user with the specified role.
     * This is needed for creating the base admin user.
     * @param userRole the role of the users to look for
     * @param enabled whether the user is enabled or not
     * @return the amount of users found with the given role and enabled status
     */
    public long countAllByUserRoleEqualsAndEnabled(final UserRole userRole, final Boolean enabled) {
        Query query = entityManager.createQuery(
                "select count(u) from UserEntity u where u.userRole = :userRole and u.enabled = :enabled");
        query.setParameter("userRole", userRole);
        query.setParameter("enabled", enabled);
        return (Long) query.getSingleResult();
    }

    /**
     * Save an entity to the database.
     * @param entity the entity to save
     * @apiNote The transactional annotation is needed because if the persist fails,
     * it needs to be able to roll back the transaction.
     */
    @Transactional
    public void internalSave(final Object entity) {
        entityManager.persist(entity);
    }
}
