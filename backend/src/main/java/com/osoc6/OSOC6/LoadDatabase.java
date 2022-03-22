package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadDatabase {
    /**
     * Logger to display messages in console.
     */
    private static final Logger LOGGER = LoggerFactory.getLogger(LoadDatabase.class);

    /**
     * A bean gets run automatically when springboot runs.
     * This populates the project table.
     * @param repository the project repository
     * @return a commandline runner
     */
    @Bean
    CommandLineRunner initDatabaseUser(final UserRepository repository) {

        return args -> {
            LOGGER.info("Preloading user1");
            UserEntity user1 = new UserEntity("bob@tester.com", "Bob", "Tester", UserRole.ADMIN, "123456");
            repository.save(user1);

            LOGGER.info("Preloading user2");
            UserEntity user2 = new UserEntity("frank@gmail.com", "Frank", "Woods", UserRole.DISABLED, "123456");
            repository.save(user2);
        };
    }
}
