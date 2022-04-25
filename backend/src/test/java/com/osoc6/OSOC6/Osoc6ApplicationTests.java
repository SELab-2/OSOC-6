package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Auto generated class that tests if the context can be loaded.
 */
@SpringBootTest
class Osoc6ApplicationTests extends BaseTestPerformer<UserEntity, Long, UserRepository> {
    @Autowired
    private UserRepository userRepository;

    private String baseAdminEmail;

    @Override
    public Long get_id(final UserEntity entity) {
        return entity.getId();
    }

    @Override
    public UserRepository get_repository() {
        return userRepository;
    }

    @Override
    public void setUpRepository() { }

    @Override
    public void removeSetUpRepository() { }

    @Test
    public void test() {
        Osoc6Application.main(new String[]{
                "--spring.main.web-environment=false",
        });
    }

}
