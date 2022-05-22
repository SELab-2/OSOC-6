package com.osoc6.OSOC6.configuration;

import com.osoc6.OSOC6.service.UserEntityService;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Arrays;

/**
 * This class sets up the configuration to handle the authentication process.
 */
@Configuration
@AllArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    /**
     * This service is used to load user-specific data.
     */
    private final UserEntityService userService;
    /**
     * The encoder is used to encode the passwords.
     */
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * Environment of the application, needed to access the active profiles.
     */
    private Environment environment;

    /**
     * This function configures the AuthenticationManager used for the login-system.
     * @param auth the builder used to create an AuthenticationManager
     */
    @Override
    protected void configure(final AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    /**
     * This method configures the HttpSecurity.
     * @param http the HttpSecurity to modify
     * @throws Exception due to the csrf protection
     */
    @Override
    protected void configure(final HttpSecurity http) throws Exception {
        // In production, we only use secured communication (https)
        if (Arrays.asList(environment.getActiveProfiles()).contains("production")) {
            http.requiresChannel().anyRequest().requiresSecure();
        }

        http
            // Cross-site request forgery protection needs to be disabled for logging in from frontend
            .csrf().disable().httpBasic()
            .and()
            .authorizeRequests()
                .antMatchers("/" + DumbledorePathWizard.REGISTRATION_PATH,
                        "/" + DumbledorePathWizard.LOGIN_PATH + "*",
                        "/" + DumbledorePathWizard.AUTH_PATH + "/*",
                        "/" + DumbledorePathWizard.FORGOT_PASSWORD_PATH,
                        "/" + DumbledorePathWizard.RESET_PASSWORD_PATH,
                        "/" + DumbledorePathWizard.WEBHOOK_PATH).permitAll()
                .anyRequest().authenticated()
            .and()
            .formLogin()
            .and()
            .logout()
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID");
    }

    /**
     * This function sets up a DAO to retrieve the user details needed for the authentication process.
     * @return a DAO for authentication
     */
    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }

    /**
     * Set up the role hierarchy.
     * @return the configured role hierarchy
     */
    @Bean
    public RoleHierarchy roleHierarchy() {
        RoleHierarchyImpl roleHierarchy = new RoleHierarchyImpl();
        String hierarchy = "ADMIN > COACH";
        roleHierarchy.setHierarchy(hierarchy);
        return roleHierarchy;
    }
}
