package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Class testing the integration of {@link Organisation}.
 */
public class OrganisationEndpointTests extends EndpointTest<Organisation, OrganisationRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private OrganisationRepository repository;

    /**
     * First sample organisation that gets loaded before every test.
     */
    private final Organisation organisation1 = new Organisation();

    /**
     * Second sample organisation that gets loaded before every test.
     */
    private final Organisation organisation2 = new Organisation();

    /**
     * The actual path organisations are served on, with '/' as prefix.
     */
    private static final String ORGANISATIONS_PATH = "/" + DumbledorePathWizard.ORGANISATIONS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Intel";

    /**
     * The string that will be set as info to the above organisation.
     */
    private static final String ORGANISATION_INFO = "Experience what's inside";

    public OrganisationEndpointTests() {
        super(ORGANISATIONS_PATH, TEST_STRING);
    }

    /**
     * Add two test organisations to the database.
     */
    @BeforeEach
    public void setUp() {
        organisation1.setName("Cynalco Medics");
        organisation1.setInfo("Cynaco go go!");
        repository.save(organisation1);

        organisation2.setName("Apple");
        organisation2.setInfo("Think different");
        repository.save(organisation2);
    }

    /**
     * Remove the two test organisations from the database.
     */
    @AfterEach
    public void remove_test_organisations() {
        if (repository.existsById(organisation1.getId())) {
            repository.deleteById(organisation1.getId());
        }
        if (repository.existsById(organisation2.getId())) {
            repository.deleteById(organisation2.getId());
        }
    }

    @Override
    public final Organisation create_entity() {
        Organisation postOrganisation = new Organisation();
        postOrganisation.setName(TEST_STRING);
        postOrganisation.setInfo(ORGANISATION_INFO);
        return postOrganisation;
    }

    @Override
    public final Organisation change_entity(final Organisation organisation) {
        return create_entity();
    }

    @Override
    public final OrganisationRepository get_repository() {
        return repository;
    }

    @Override
    public final Long get_id(final Organisation organisation) {
        return organisation.getId();
    }
}
