package com.osoc6.OSOC6.configurationTest;

import com.osoc6.OSOC6.entities.UserEntity;
import com.osoc6.OSOC6.entities.UserRole;
import com.osoc6.OSOC6.repository.PublicRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
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
 * Class used to test whether the base admin user gets reset on startup when there are no enabled admins.
 */
@Import(BaseAdminTestConfig.class)
@SpringBootTest
public class BaseAdminResetTest {
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
    public void user_with_same_email_as_base_admin_gets_reset_on_startup() {
        Optional<UserEntity> optionalUserEntity = publicRepository.internalFindByEmail(baseAdminEmail);

        assertTrue(optionalUserEntity.isPresent());
        UserEntity userEntity = optionalUserEntity.get();

        assertTrue(userEntity.isEnabled());
        assertEquals(UserRole.ADMIN, userEntity.getUserRole());
    }
}
