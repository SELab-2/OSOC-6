package com.osoc6.OSOC6;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Auto generated class that tests if the context can be loaded.
 */
@SpringBootTest
class Osoc6ApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    public void test() {
        Osoc6Application.main(new String[]{
                "--spring.main.web-environment=false",
        });
    }

}
