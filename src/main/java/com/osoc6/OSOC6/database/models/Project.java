package com.osoc6.OSOC6.database.models;

import javax.persistence.*;
import java.util.List;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ElementCollection
    private List<String> goals;

    private String name;

    // TODO: Location?

    public List<String> getGoals() {
        return goals;
    }

    public String getName() {
        return name;
    }
}
