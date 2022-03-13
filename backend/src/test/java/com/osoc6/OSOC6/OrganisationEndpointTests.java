package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.osoc6.OSOC6.database.models.Organisation;
import com.osoc6.OSOC6.repository.OrganisationRepository;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrganisationEndpointTests {

    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * Repository which is the connection to the database for Organisations.
     */
    @Autowired
    private OrganisationRepository repository;

    /**
     * Check if the repository accepts new organisation.
     * @exception Exception throws exception if not there
     */
    @Test
    public void addNewOrganisation() throws Exception {
        Organisation testOrganisation = new Organisation();
        String organisationName = "TEST ORGANISATION";
        testOrganisation.setName(organisationName);
        repository.save(testOrganisation);

        this.mockMvc.perform(get("/organisations")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(organisationName)));
    }

    /**
     * Check if we can add a organisation via a POST request.
     * @exception Exception throws exception if not there
     */
    @Test
    public void postNewOrganisation() throws Exception {
        Organisation newOrganisation = new Organisation();
        String organisationName = "POST TEST ORGANISATION";
        newOrganisation.setName(organisationName);

        mockMvc.perform(post("/organisations")
                .content(asJsonString(newOrganisation))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        this.mockMvc.perform(get("/organisations")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(organisationName)));

    }

    /**
     * Check if we can delete a organisation via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    public void deleteOrganisation() throws Exception {
        List<Organisation> organisations = repository.findAll();
        Organisation organisation = organisations.get(0);

        // Is the project really in /projects
        this.mockMvc.perform(get("/organisations")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(organisation.getName())));

        // Run the delete request
        this.mockMvc.perform(delete("/organisations/" + organisation.getId())).andDo(print());

        // Check if still there
        this.mockMvc.perform(get("/organisations")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(not(containsString(organisation.getName()))));
    }

    /**
     * Transforms object to json string for a request.
     * @param obj object which needs to be converted to JSON
     * @return JSON string which contains the object
     */
    public static String asJsonString(final Object obj) {
        try {
            final ObjectMapper objMapper = new ObjectMapper();
            return objMapper.writeValueAsString(obj);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
