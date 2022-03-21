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
import java.net.URI;
import java.util.Set;

/**
 * The database entity for a Organisation.
 * This just represents a real world organisation,
 * information about the organisation is held in an external tool.
 * The URI in the organisation identifies this location.
 */
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
     * A URI pointing to the website of the organisation.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI website;

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
