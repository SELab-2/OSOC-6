package com.osoc6.OSOC6.configuration;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.PublicRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;

import java.util.Optional;
import java.util.Properties;

/**
 * The configuration of the application.
 * This class wil load and set up anything non-default needed to run the application.
 */
@Configuration
public class WebConfiguration {

    /**
     * Get the message source validation-message.properties file containing all the validation messages.
     * @return the message source
     */
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:validation-messages");
        return messageSource;
    }

    /**
     * Set up the LocalValidatorFactoryBean to use messages from the specified message source.
     * @return the configured LocalValidatorFactoryBean
     */
    @Bean
    public LocalValidatorFactoryBean getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource());
        return bean;
    }

    /**
     * This creates a base admin user when there are no enabled admins left in the database.
     * @param publicRepository the public repository
     * @param passwordEncoder the used password encoder
     * @return a commandline runner
     * @apiNote The profile annotation indicates that this method should not be executed when the application
     * is run with a test profile.
     */
    @Bean
    @Profile("!test")
    CommandLineRunner initBaseAdminUser(final PublicRepository publicRepository,
                                        final BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (publicRepository.countAllByUserRoleEqualsAndEnabled(UserRole.ADMIN, true) == 0) {
                Resource resource = new ClassPathResource("initial-user.properties");
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);

                String baseEmail = properties.getProperty("baseuser.email");
                String basePassword = properties.getProperty("baseuser.password");
                String encodedPassword = passwordEncoder.encode(basePassword);

                UserEntity baseAdminUser = new UserEntity();

                Optional<UserEntity> optionalUser = publicRepository.internalFindByEmail(baseEmail);
                if (optionalUser.isPresent()) {
                    baseAdminUser = optionalUser.get();
                }

                baseAdminUser.setEmail(baseEmail);
                baseAdminUser.setPassword(encodedPassword);
                baseAdminUser.setCallName("Base Admin User");
                baseAdminUser.setUserRole(UserRole.ADMIN);
                baseAdminUser.setEnabled(true);

                if (optionalUser.isPresent()) {
                    publicRepository.internalUpdate(baseAdminUser);
                } else {
                    publicRepository.internalSave(baseAdminUser);
                }
            }
        };
    }
}
