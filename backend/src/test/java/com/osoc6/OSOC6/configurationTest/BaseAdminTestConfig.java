package com.osoc6.OSOC6.configurationTest;

import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.UserRole;
import com.osoc6.OSOC6.repository.PublicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

import java.util.Properties;

/**
 * Test configuration to initialize the base admin user. This is needed for the {@link BaseAdminResetTest}.
 *
 * The TestConfiguration annotation makes it so that this configuration is not added to the application context when
 * the regular application is run.
 */
@TestConfiguration
public class BaseAdminTestConfig {
    /**
     * Initialises the base admin user but set him to disabled and a coach.
     * @param publicRepository the public repository
     * @return a command line runner
     * @apiNote test
     */
    @Bean
    CommandLineRunner initDisabledBaseAdmin(final PublicRepository publicRepository) {
        return args -> {
            Resource resource = new ClassPathResource("initial-user.properties");
            Properties properties = PropertiesLoaderUtils.loadProperties(resource);

            String baseEmail = properties.getProperty("baseuser.email");

            UserEntity baseAdminUser = new UserEntity();

            baseAdminUser.setEmail(baseEmail);
            baseAdminUser.setPassword("123456");
            baseAdminUser.setCallName("Different name");
            baseAdminUser.setUserRole(UserRole.COACH);
            baseAdminUser.setEnabled(false);

            publicRepository.internalSave(baseAdminUser);
        };
    }
}
