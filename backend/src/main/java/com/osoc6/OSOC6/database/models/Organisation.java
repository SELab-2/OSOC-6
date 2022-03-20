package com.osoc6.OSOC6.database.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity
@NoArgsConstructor
public class Organisation {

    /**
     * The id of the organisation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    /**
     * The info of the organisation.
     */
    @Basic(optional = false)
    @Lob
    @Getter @Setter
    private String info;

    /**
     * The name of the organisation.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String name;

    /**
     * {@link Set} of projects this Organisation is involved in.
     */
    @ManyToMany
    @Getter
    private Set<Project> projects;

    /**
     *
     * @param newInfo the info about the organisation
     * @param newName the name of the organisation
     * @param newProjects the projects belonging to the organisation
     */
    public Organisation(final String newInfo, final String newName, final Set<Project> newProjects) {
        super();
        info = newInfo;
        name = newName;
        projects = newProjects;
    }
}
