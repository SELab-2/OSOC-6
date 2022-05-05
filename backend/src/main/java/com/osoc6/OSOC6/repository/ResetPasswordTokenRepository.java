package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.ResetPasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RestResource;

import java.util.Optional;

/**
 * This repository is used to access {@link ResetPasswordToken} in the database.
 * It is not exported as an endpoint.
 */
@RestResource(exported = false)
public interface ResetPasswordTokenRepository extends JpaRepository<ResetPasswordToken, Long> {

    /**
     * Find a reset password token by it's unique token.
     * @param token the unique token of the reset password token
     * @return the reset password token with the given token or Optional#empty if none found
     */
    Optional<ResetPasswordToken> findByToken(@Param("token") String token);

}
