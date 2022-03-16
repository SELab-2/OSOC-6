package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.UserEntityDetails;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserEntityService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userEntity = userRepository.findByEmail(email);
        if (userEntity == null) {
            throw new UsernameNotFoundException(email);
        }
        return User.withUsername(userEntity.getEmail())
                .password(userEntity.getPassword())
                .authorities("USER").build();
    }
}
