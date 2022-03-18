package com.osoc6.OSOC6.security;

import com.osoc6.OSOC6.service.UserEntityService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Configuration
@AllArgsConstructor
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final UserEntityService userService;
    private final BCryptPasswordEncoder passwordEncoder;

//    @Bean
//    public UserDetailsService userDetailsService() {
//        return email -> {
//            Optional<UserEntity> user = userService.findByEmail(email);
//            if (user.isEmpty()) {
//                throw new UsernameNotFoundException("No user found with email address: " + email);
//            }
//            return (UserDetails) user.get();
//        };
//    }
    // TODO : differentiate between admin and coach

//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        PasswordEncoder encoder = passwordEncoder();
//        auth
//            .inMemoryAuthentication()
//            .withUser("user@gmail.com")
//                .password(encoder.encode("password"))
//                .roles("USER")
//                .and()
//            .withUser("admin@gmail.com")
//                .password(encoder.encode("admin"))
//                .roles("USER", "ADMIN");
//    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .authorizeRequests()
//                .antMatchers("/", "/home").permitAll()
//                .anyRequest().authenticated()
//                .and()
//            .formLogin()
//                .loginPage("/login")
//                //.usernameParameter("email")
//                .permitAll()
//                .and()
//            .logout()
//                .permitAll();
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/registration")
            .permitAll()
            .anyRequest()
            .authenticated().and()
            .formLogin();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userService);
        return provider;
    }
}
