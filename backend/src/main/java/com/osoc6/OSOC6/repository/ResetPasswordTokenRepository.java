package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.entities.ResetPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

/**
 * This repository is used to access {@link ResetPasswordToken} in the database.
 * It is not exported as an endpoint, and therefore does not need any authorization.
 */
@RepositoryRestResource(exported = false)
public interface ResetPasswordTokenRepository extends JpaRepository<ResetPasswordToken, Long> {

    /**
     * Find a reset password token by it's unique token.
     * @param token the unique token of the reset password token
     * @return the reset password token with the given token or Optional#empty if none found
     */
    @Query("select r from ResetPasswordToken r where r.token = :token")
    Optional<ResetPasswordToken> internalFindByToken(@Param("token") String token);

    /**
     * Find a reset password token belonging to the user with the given email.
     * @param email the email of the user to find a reset password token of
     * @return the found reset password token
     */
    Optional<ResetPasswordToken> findFirstBySubjectEmail(@Param("email") String email);
}
