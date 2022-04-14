package com.osoc6.OSOC6.repository;

import lombok.NonNull;

/**
 * This repository interface is used to allow internal saving of entities.
 * Another repository can extend this one to get access to these methods.
 * The implementation of this repository has to be a file with the same name as this interface and with Impl as postfix.
 * @param <T> the entity of the repository
 */
public interface InternalSaveRepository<T> {
    /**
     * Save an entity to the database.
     * @param entity the entity to save
     * @param <S> the type of the entity
     */
    <S extends T> void internalSave(@NonNull S entity);
}
