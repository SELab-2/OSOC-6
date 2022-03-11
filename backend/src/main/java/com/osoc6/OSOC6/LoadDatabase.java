package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.User;
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
            User user1 = new User();
            user1.setEmail("bob@tester.com");
            user1.setFirstName("Bob");
            user1.setLastName("Tester");
            user1.setUserRole(UserRole.ADMIN);
            repository.save(user1);

            LOGGER.info("Preloading user2");
            User user2 = new User();
            user2.setEmail("frank@gmail.com");
            user2.setFirstName("Frank");
            user2.setLastName("Woods");
            user2.setUserRole(UserRole.DISABLED);
            repository.save(user2);
        };
    }
}
