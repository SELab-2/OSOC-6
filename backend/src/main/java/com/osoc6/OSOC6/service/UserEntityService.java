package com.osoc6.OSOC6.service;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserEntityService implements UserDetailsService {

    private final static String USER_NOT_FOUND_MSG =
            "user with email %s not found";

    /**
     * The user repository, link to the database.
     */
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserEntityService(final UserRepository repository, BCryptPasswordEncoder encoder) {
        userRepository = repository;
        passwordEncoder = encoder;
    }


//    @Transactional
//    public Optional<UserEntity> findUserByEmailString(String email) throws UsernameNotFoundException {
//        return userRepository.findByEmail(email);
//    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format(USER_NOT_FOUND_MSG, email)));
    }

    public String registerUser(UserEntity userEntity) {
        boolean accountExists = userRepository.findByEmail(userEntity.getEmail()).isPresent();

        if (accountExists) {
            // TODO : check whether the account was confirmed
            throw new IllegalStateException("This email-address is already assigned to an account");
        }

        String encodedPassword = passwordEncoder.encode(userEntity.getPassword());
        userEntity.setPassword(encodedPassword);

        userRepository.save(userEntity);

        return "it works";
    }
}
