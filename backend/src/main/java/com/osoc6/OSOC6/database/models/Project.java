package com.osoc6.OSOC6.database.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.osoc6.OSOC6.winterhold.RadagastNumberWizard;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.ReadOnlyProperty;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * The database entity for a project.
 * A project is something Students work on within an edition.
 * A project has coaches to help the students and is typically done for or with help of a partner.
 */
@Entity
@Table(indexes = {@Index(unique = false, columnList = "edition_id")})
@NoArgsConstructor
public final class Project implements WeakToEdition {

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
    private List<String> goals = new ArrayList<>();

    /**
     * The name of the project.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String name;

    /**
     * Info about the project.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String info = "";

    /**
     * A URI pointing to the version management of the project.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String versionManagement = "";

    /**
     * Edition within which this project was created.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @Getter
    private Edition edition;

    /**
     * The name of the partner behind the project.
     */
    @Basic(optional = false)
    @Column(length = RadagastNumberWizard.CALL_NAME_LENGTH)
    @Getter @Setter
    private String partnerName;

    /**
     * A URI pointing to the website of the partner.
     */
    @Basic(optional = false)
    @Column(columnDefinition = "text")
    @Getter @Setter
    private String partnerWebsite = "";

    /**
     * The {@link UserEntity}/ admin that created the project.
     */
    @ManyToOne(optional = false)
    @ReadOnlyProperty
    @Getter
    private UserEntity creator;

    /**
     * The skills needed in this project.
     */
    @OneToMany(orphanRemoval = true, mappedBy = "project")
    @Getter
    private List<ProjectSkill> neededSkills = new ArrayList<>();

    /**
     * The Users that will coach this project.
     */
    @ManyToMany
    @Getter
    private List<UserEntity> coaches = new ArrayList<>();

    /**
     *
     * @param newName the name of the project
     * @param newEdition the edition that the project is associated with
     * @param newPartner the name of the partner
     * @param newCreator the creator of the project
     */
    public Project(final String newName, final Edition newEdition,
                   final String newPartner, final UserEntity newCreator) {
        super();
        name = newName;
        edition = newEdition;
        partnerName = newPartner;
        creator = newCreator;
    }

    @Override @JsonIgnore
    public Edition getControllingEdition() {
        return edition;
    }
}
