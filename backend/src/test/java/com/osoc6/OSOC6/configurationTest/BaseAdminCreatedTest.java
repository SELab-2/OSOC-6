package com.osoc6.OSOC6.configurationTest;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.PublicRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.test.annotation.DirtiesContext;

import java.io.IOException;
import java.util.Optional;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Class used to test whether the base admin user gets created on startup when there are no enabled admins.
 */
@SpringBootTest
public class BaseAdminCreatedTest {
    /**
     * The public repository, used to access the database without authorization.
     */
    @Autowired
    private PublicRepository publicRepository;

    /**
     * The email of the base admin user.
     */
    private static String baseAdminEmail;

    @BeforeAll
    static void setup() throws IOException {
        Resource resource = new ClassPathResource("initial-user.properties");
        Properties properties = PropertiesLoaderUtils.loadProperties(resource);

        baseAdminEmail = properties.getProperty("baseuser.email");
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
    public void no_base_admin_on_startup_creates_base_admin_user() {
        Optional<UserEntity> optionalUserEntity = publicRepository.internalFindByEmail(baseAdminEmail);

        assertTrue(optionalUserEntity.isPresent());
        UserEntity userEntity = optionalUserEntity.get();

        assertTrue(userEntity.isEnabled());
        assertEquals(UserRole.ADMIN, userEntity.getUserRole());
    }
}
