package com.osoc6.OSOC6.repository;


import org.springframework.stereotype.Component;

@Component("testBean")
public class TestBean {
    public Object identity(Object id) {
        System.out.println(id);
        return id;
    }
}
