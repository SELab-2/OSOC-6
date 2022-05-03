package com.osoc6.OSOC6.eventhandler;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Optional;

/**
 * This class can be used to add functionality before certain events related to the {@link UserEntity}.
 */
@Component
@RepositoryEventHandler
@RequiredArgsConstructor
public class UserEntityEventHandler {

    /**
     * The encoder used to encode the passwords.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * The user repository, used to access users from the database.
     */
    private final UserRepository userRepository;

    /**
     * The entity manager, used to interact with the persistence context.
     */
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Before updating the user, if they changed their password, then encode the new password.
     * @param newUserEntity the updated user
     */
    @HandleBeforeSave
    public void handleBeforeSaveEvent(final UserEntity newUserEntity) {
        // We need to detach the user to be able to get the old user entity
        entityManager.detach(newUserEntity);
        Optional<UserEntity> currentUserEntity = userRepository.findById(newUserEntity.getId());
        if (currentUserEntity.isPresent()
                && !newUserEntity.getPassword().equals(currentUserEntity.get().getPassword())) {
            String encodedPassword = passwordEncoder.encode(newUserEntity.getPassword());
            newUserEntity.setPassword(encodedPassword);
        }
    }
}
