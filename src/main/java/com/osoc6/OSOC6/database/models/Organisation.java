package com.osoc6.OSOC6.database.models;

import javax.persistence.*;
import java.util.List;

@Entity
public class Organisation {

    private String info;
    private String name;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    protected Organisation() {}

    public Organisation(String info, String name) {
        this.info = info;
        this.name = name;
    }

    public String getInfo() {
        return info;
    }

    public String getName() {
        return name;
    }
}
