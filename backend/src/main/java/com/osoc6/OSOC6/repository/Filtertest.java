package com.osoc6.OSOC6.repository;

import org.springframework.stereotype.Component;

@Component("myFilterTest")
public class Filtertest {
    public boolean testField(final Object userEntity) {

        return true;
    }
}
