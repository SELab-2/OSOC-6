package com.osoc6.OSOC6.repository;

import lombok.NonNull;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * This repository implementation is used to allow internal saving of entities.
 * @param <T> the entity of the repository
 */
@Repository
public class InternalSaveRepositoryImpl<T> implements InternalSaveRepository<T> {

    /**
     * The entity manager, used to interact with the persistence context.
     */
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Save an entity to the database.
     * @param entity the entity to save
     * @param <S> the type of the entity
     * @apiNote The transactional annotation is needed because if the persist fails,
     * it needs to be able to roll back the transaction.
     */
    @Transactional
    public <S extends T> void internalSave(@NonNull final S entity) {
        entityManager.persist(entity);
    }
}
