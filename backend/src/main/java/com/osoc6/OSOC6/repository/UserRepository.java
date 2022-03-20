package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

/**
 * This repository takes care of the retrieval of users.
 */
@Repository
@Transactional(readOnly = true)
public interface UserRepository  extends JpaRepository<UserEntity, Long> {
    /**
     * This method finds the user with a given email address.
     * @param email email address of the searched user
     * @return if there is an account for the given email, the user will be returned
     */
    Optional<UserEntity> findByEmail(String email);
}
