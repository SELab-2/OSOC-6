package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link Organisation}.
 */
public class AdminOrganisationEndpointTests extends AdminEndpointTest<Organisation, Long, OrganisationRepository> {

    /**
     * The organisation repository which saves, searches, ... in the database
     */
    @Autowired
    private OrganisationRepository organisationRepository;

    /**
     * The project repository which saves, searches, ... in the database
     */
    @Autowired
    private ProjectRepository projectRepository;

    /**
     * The edition repository which saves, searches, ... in the database
     */
    @Autowired
    private EditionRepository editionRepository;

    /**
     * Sample edition that gets loaded before every test.
     */
    private final Edition edition = new Edition();

    /**
     * First sample organisation that gets loaded before every test.
     */
    private final Organisation organisation1 = new Organisation();

    /**
     * Second sample organisation that gets loaded before every test.
     */
    private final Organisation organisation2 = new Organisation();

    /**
     * First sample project that gets loaded before every test.
     */
    private final Project project1 = new Project();

    /**
     * Second sample project that gets loaded before every test.
     */
    private final Project project2 = new Project();

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

    public AdminOrganisationEndpointTests() {
        super(ORGANISATIONS_PATH, TEST_STRING);
    }

    /**
     * Add two test organisations to the database.
     */
    @Override
    public void setUpRepository() {
        loadUser();

        organisation1.setName("Cynalco Medics");
        organisation1.setInfo("Cynalco go go!");

        edition.setActive(true);
        edition.setName("OSOC2022");
        edition.setYear(2022);

        editionRepository.save(edition);

        project1.setName("Facebook");
        project1.setEdition(edition);
        project1.setPartner(organisation1);
        project1.setCreator(getAdminUser());
        projectRepository.save(project1);

        organisation2.setName("Apple");
        organisation2.setInfo("Think different");

        project2.setName("New chip");
        project2.setEdition(edition);
        project2.setPartner(organisation2);
        project2.setCreator(getAdminUser());
        projectRepository.save(project2);
    }

    /**
     * Remove the two test organisations from the database.
     */
    @Override
    public void removeSetUpRepository() {
        organisationRepository.deleteAll();
        projectRepository.deleteAll();
        removeUser();
        editionRepository.deleteAll();
    }

    @Override
    public final Organisation create_entity() {
        Organisation postOrganisation = new Organisation(ORGANISATION_INFO, TEST_STRING, null);
        return postOrganisation;
    }

    @Override
    public final Map<String, String> change_entity(final Organisation organisation) {
        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);
        return patchMap;
    }

    @Override
    public final OrganisationRepository get_repository() {
        return organisationRepository;
    }

    @Override
    public final Long get_id(final Organisation organisation) {
        return organisation.getId();
    }

    @Test
    @WithUserDetails(value = "admin@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_all_works() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(organisation1.getName()))
                .andExpect(string_to_contains_string(organisation2.getName()));
    }
}
