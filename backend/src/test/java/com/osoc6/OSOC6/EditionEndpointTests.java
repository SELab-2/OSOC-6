package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.dto.EditionDTO;
import com.osoc6.OSOC6.repository.EditionRepository;
import com.osoc6.OSOC6.service.EditionService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EditionEndpointTests {

    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private EditionRepository repository;

    /**
     * Service which is the connection to the database for editions via a repository.
     */
    @Autowired
    private EditionService service;

    /**
     * First sample edition that gets loaded before every test.
     */
    private final Edition edition1 = new Edition();

    /**
     * Second sample edition that gets loaded before every test.
     */
    private final Edition edition2 = new Edition();

    /**
     * Add two test editions to the database.
     */
    @BeforeEach
    public void setUp() {
        edition1.setName("Edition 1");
        edition1.setYear(0);
        edition1.setActive(false);
        repository.save(edition1);

        edition2.setName("Edition 2");
        edition2.setYear(1);
        edition2.setActive(true);
        repository.save(edition2);
    }

    /**
     * Remove the two test editions from the database.
     */
    @AfterEach
    public void removeTestUsers() {
        if (repository.existsById(edition1.getName())) {
            repository.deleteById(edition1.getName());
        }
        if (repository.existsById(edition2.getName())) {
            repository.deleteById(edition2.getName());
        }
    }

    /**
     * Check if the repository accepts new editions.
     * @exception Exception throws exception if not there
     */
    @Test
    public void addNewEdition() throws Exception {
        String editionName = "EDITION 2022";
        EditionDTO newEdition = new EditionDTO();
        newEdition.setName(editionName);
        newEdition.setYear(1);
        newEdition.setActive(true);

        this.service.createEdition(newEdition);

        this.mockMvc.perform(get("/editions")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(editionName)));
    }

    /**
     * Check if we can add an edition via a POST request.
     * @exception Exception throws exception if not there
     */
    @Test
    public void postNewEdition() throws Exception {
        EditionDTO newEdition = new EditionDTO();
        String editionName = "POST EDITION";
        newEdition.setName(editionName);
        newEdition.setYear(1);
        newEdition.setActive(true);

        mockMvc.perform(post("/editions")
                .content(asJsonString(newEdition))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        this.mockMvc.perform(get("/editions")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(editionName)));

    }

    /**
     * Check if we can delete an edition via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    public void deleteEdition() throws Exception {
        List<Edition> editions = this.service.getAll();
        Edition edition = editions.get(0);

        // Is the project really in /editions
        this.mockMvc.perform(get("/editions")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(edition.getName())));

        // Run the delete request
        this.mockMvc.perform(delete("/editions/" + edition.getName())).andDo(print());

        // Check if still there
        if (repository.existsById(edition.getName())) {
            throw new Exception();
        }

    }

    @Test
    public void delete_edition_throws_not_fount() throws Exception {
        List<Edition> editions = this.service.getAll();
        Edition edition = editions.get(0);

        // Is the project really in /editions
        this.mockMvc.perform(get("/editions")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(edition.getName())));

        // Run the delete request
        this.mockMvc.perform(delete("/editions/" + edition.getName())).andDo(print());

        this.mockMvc.perform(delete("/editions/" + edition.getName())).andExpect(result -> {
            Assertions.assertTrue(
                    result.getResponse().getContentAsString().contains("Could not find edition with name Edition 1")
            );
        });
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
