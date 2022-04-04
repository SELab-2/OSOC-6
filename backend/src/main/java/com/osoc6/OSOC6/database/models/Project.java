package com.osoc6.OSOC6.database.models;

import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 * The database entity for a project.
 * A project is something Students work on within an edition.
 * A project has coaches to help the students and is typically done for or with help of an organisation.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_id")})
@NoArgsConstructor
public class Project {

    /**
     * The id of the project.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Getter
    private Long id;

    /**
     * The goals of the project.
     */
    @ElementCollection
    @Getter
    private List<String> goals;

    /**
     * The name of the project.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String name;

    /**
     * A URI pointing to the version management of the project.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI versionManagement;

    /**
     * Edition within which this project was created.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private Edition edition;

    /**
     * The name of the organisation behind the project.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String organisation;

    /**
     * The info about the organisation.
     */
    @Basic(optional = false)
    @Lob
    @Getter @Setter
    private String about;

    /**
     * A URI pointing to the website of the organisation.
     */
    @Basic
    @Lob
    @Getter @Setter
    private URI website;

//    /**
//     * Partner that is involved in this project.
//     */
//    @OneToOne(optional = true, cascade = CascadeType.ALL)
//    @JoinColumn(name = "partner_id", referencedColumnName = "id")
//    @Getter @Setter
//    private Organisation partner;

    /**
     * The {@link UserEntity}/ admin that created the project.
     */
    @ManyToOne(optional = false)
    @Getter @Setter
    private UserEntity creator;

    /**
     * The skills needed in this project.
     */
    @OneToMany(orphanRemoval = true)
    @Getter @Setter
    private List<Skill> neededSkills;

    /**
     * The Users that will coach this project.
     */
    @ManyToMany
    @Getter
    private List<UserEntity> coaches;

    /**
     *
     * @param newName the name of the project
     * @param newEdition the edition that the project is associated with
     * @param newOrganisation the organisation that the project belongs to
     * @param newAbout the info about the organisation
     * @param newCreator the creator of the project
     */
    public Project(final String newName, final Edition newEdition,
                   final String newOrganisation, final String newAbout, final UserEntity newCreator) {
        super();
        goals = new ArrayList<>();
        name = newName;
        edition = newEdition;
        organisation = newOrganisation;
        about = newAbout;
        creator = newCreator;
        neededSkills = new ArrayList<>();
        coaches = new ArrayList<>();
    }
}
