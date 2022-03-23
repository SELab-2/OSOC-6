package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import java.util.List;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link Organisation}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public final class OrganisationEndpointTests {

    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

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
     * Path of organisations. This must be prepended with a '/'.
     */
    private static final String ORGANISATIONS_PATH = "/" + DumbledorePathWizard.ORGANISATIONS_PATH;

    /**
     * An illegal id for an organisation.
     */
    private static final long ILLEGAL_ID = 0L;

    /**
     * Some name for an organisation.
     */
    private static final String ILLEGAL_NAME = "Some name";

    @BeforeEach
    public void setUp() {
        organisation1.setName("Cynalco Medics");
        organisation1.setInfo("Cynalco go go!");
        repository.save(organisation1);

        organisation2.setName("Krusty Burger");
        organisation2.setInfo("Hey Hey!");
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

    /**
     * Check if we can create a new organisation via a POST request.
     * @exception Exception throws exception is organisation not created
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void post_new_organisation() throws Exception {
        Organisation newOrganisation = new Organisation();
        String organisationName = "Cynalco Medics";
        newOrganisation.setName(organisationName);
        newOrganisation.setInfo("Cynalco go go!");

        mockMvc.perform(post(ORGANISATIONS_PATH)
                .content(Util.asJsonString(newOrganisation))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(get(ORGANISATIONS_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(organisationName)));
    }

    /**
     * Check if we can delete an organisation via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_organisation() throws Exception {
        List<Organisation> organisations = repository.findAll();
        Organisation organisation = organisations.get(0);

        // Check whether the organisation is really there
        mockMvc.perform(get(ORGANISATIONS_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(organisation.getName())));

        // Run the delete request
        mockMvc.perform(delete(ORGANISATIONS_PATH + "/" + organisation.getId()));

        // Check if the organisation is still there
        if (repository.existsById(organisation.getId())) {
            throw new Exception();
        }
    }

    /**
     * Test if deleting non-existing organisation throws exception.
     * @exception  Exception throws exception if not found
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_organisation_throws_not_found() throws Exception {
        List<Organisation> organisations = repository.findAll();
        Organisation edition = organisations.get(0);

        // Check whether the organisation is really there
        mockMvc.perform(get(ORGANISATIONS_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(edition.getName())));

        // Run the delete request
        mockMvc.perform(delete(ORGANISATIONS_PATH + "/" + edition.getId()));

        mockMvc.perform(delete(ORGANISATIONS_PATH + "/" + edition.getId()))
                .andExpect(status().isNotFound());
    }

    /**
     * Test if getting non-existing organisation throws exception.
     * @exception  Exception throws exception if not found
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void getting_illegal_organisation_fails() throws Exception {
        mockMvc.perform(get(ORGANISATIONS_PATH + "/" + ILLEGAL_ID))
                .andExpect(status().isNotFound())
                .andExpect(content().string(not(emptyString())));
    }

    /**
     * Test if patching non-existing organisation throws exception.
     * @exception  Exception throws exception if not found
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void patching_illegal_organisation_fails() throws Exception {
        Organisation organisation = new Organisation();
        organisation.setName("Vandam Plastic");
        organisation.setInfo("Dré Vandam");

        mockMvc.perform(patch(ORGANISATIONS_PATH + "/" + ILLEGAL_ID)
                .content(Util.asJsonString(organisation))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string(not(emptyString())));
    }

    /**
     * Test if using string instead of long as id throws exception.
     * @exception  Exception throws exception if bad request
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void getting_illegal_organisation_fails_name() throws Exception {
        mockMvc.perform(get(ORGANISATIONS_PATH + "/" + ILLEGAL_NAME)).andExpect(status().isBadRequest());
    }
}
