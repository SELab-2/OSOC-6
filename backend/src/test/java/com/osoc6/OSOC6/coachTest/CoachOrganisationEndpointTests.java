package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.Invitation;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.database.models.UserEntity;
import com.osoc6.OSOC6.database.models.UserRole;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.repository.InvitationRepository;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.repository.UserRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Organisation} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class CoachOrganisationEndpointTests
        extends TestFunctionProvider<Organisation, Long, OrganisationRepository> {

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
     * The invitation repository which saves, searches, ... in the database
     */
    @Autowired
    private InvitationRepository invitationRepository;

    /**
     * The user repository which saves, searches, ... in the database
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Sample organisation that gets loaded before every test.
     */
    private final Organisation organisation = new Organisation();

    /**
     * Sample edition that gets loaded before every test.
     */
    private final Edition edition = new Edition();

    /**
     * Sample project that gets loaded before every test.
     */
    private final Project project = new Project();

    /**
     * The coach sample user that gets loaded before every test.
     */
    private final UserEntity coachUser = new UserEntity();

    /**
     * Sample invitation that gets loaded before every test.
     */
    private final Invitation invitation = new Invitation(edition, coachUser, coachUser);

    /**
     * The actual path organisations are served on, with '/' as prefix.
     */
    private static final String ORGANISATIONS_PATH = "/" + DumbledorePathWizard.ORGANISATIONS_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Intel Inc.";

    /**
     * The string that will be set as info to the above organisation.
     */
    private static final String ORGANISATION_INFO = "Experience what's inside";

    public CoachOrganisationEndpointTests() {
        super(ORGANISATIONS_PATH, TEST_STRING);
    }

    /**
     * Returns the OrganisationRepository that's being used.
     * @return the OrganisationRepository
     */
    @Override
    public OrganisationRepository get_repository() {
        return organisationRepository;
    }

    /**
     *
     * @param entity entity whose id we would like to know
     * @return the id of the Organisation
     */
    @Override
    public Long get_id(final Organisation entity) {
        return entity.getId();
    }

    /**
     * Add two test organisations to the database.
     */
    @Override
    public void setUpRepository() {
        organisation.setName("Cynalco Medics");
        organisation.setInfo("Cynalco go go!");

        edition.setActive(true);
        edition.setName("OSOC2022");
        edition.setYear(2022);

        editionRepository.save(edition);

        coachUser.setEmail("test@mail.com");
        coachUser.setCallName("test coach");
        coachUser.setUserRole(UserRole.COACH);
        coachUser.getReceivedInvitations().add(invitation);
        coachUser.setPassword("password");

        userRepository.save(coachUser);

        invitation.setEdition(edition);
        invitation.setIssuer(coachUser);
        invitation.setSubject(coachUser);
        invitationRepository.save(invitation);

        project.setName("Facebook");
        project.setEdition(edition);
        project.setPartner(organisation);
        project.setCreator(coachUser);

        projectRepository.save(project);
    }

    /**
     * Remove the two test organisations from the database.
     */
    @Override
    public void removeSetUpRepository() {
        organisationRepository.deleteAll();
        projectRepository.deleteAll();
        userRepository.deleteAll();
        invitationRepository.deleteAll();
        editionRepository.deleteAll();
    }

    /**
     * Creates a new Organisation.
     * @return a new Organisation
     */
    @Override
    public Organisation create_entity() {
        return new Organisation(ORGANISATION_INFO, TEST_STRING, null);
    }

    /**
     * Get a map telling us what fields to change to which values.
     * @param startEntity the entity we would like to change
     * @return a map with field names and new values
     */
    @Override
    public Map<String, String> change_entity(final Organisation startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("name", TEST_STRING);
        return changeMap;
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_all_works() throws Exception {
        base_get_all_entities_succeeds()
                .andExpect(string_to_contains_string(organisation.getName()));
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_name_works() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();
        base_test_all_queried_assertions(
                ORGANISATIONS_PATH + "/search/findByName", "name", randomOrganisation.getName());
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void post_new_organisation_fails() throws Exception {
        Organisation randomOrganisation = create_entity();
        perform_post(ORGANISATIONS_PATH, randomOrganisation).andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void delete_organisation_fails() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();
        perform_delete_with_id(ORGANISATIONS_PATH, randomOrganisation.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_legal_entity_succeeds() throws Exception {
        base_getting_legal_entity_succeeds();
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_organisation_fails() throws Exception {
        Organisation randomOrganisation = get_random_repository_entity();

        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("name", TEST_STRING);

        perform_patch(ORGANISATIONS_PATH + "/" + randomOrganisation.getId(), patchMap)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithUserDetails(value = "test@mail.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}

