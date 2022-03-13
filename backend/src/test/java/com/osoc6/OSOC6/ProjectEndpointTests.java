package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.repository.ProjectRepository;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
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
public class ProjectEndpointTests {

    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * Repository which is the connection to the database for Projects.
     */
    @Autowired
    private ProjectRepository repository;

    /**
     * Load database loads database with 2 projects
     * check if first one is present.
     * @exception Exception throws exception if not there
     */
    @Test
    @Order(1)
    public void shouldContainOSOC1() throws Exception {
        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("OSOC 1")));
    }

    /**
     * Load database loads database with 2 projects
     * check if second one is present.
     * @exception Exception throws exception if not there
     */
    @Test
    @Order(2)
    public void shouldContainOSOC2() throws Exception {
        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString("OSOC 2")));
    }

    /**
     * Check if the repository accepts new projects.
     * @exception Exception throws exception if not there
     */
    @Test
    public void addNewProject() throws Exception {
        Project testProject = new Project();
        String projectName = "TEST PROJECT";
        testProject.setName(projectName);
        repository.save(testProject);

        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(projectName)));
    }

    /**
     * Check if we can add a project via a POST request.
     * @exception Exception throws exception if not there
     */
    @Test
    public void postNewProject() throws Exception {
        Project newProject = new Project();
        String projectName = "POST TEST";
        newProject.setName(projectName);

        mockMvc.perform(post("/projects")
                .content(asJsonString(newProject))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(projectName)));

    }

    /**
     * Check if we can delete a project via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    public void deleteProject() throws Exception {
        List<Project> projects = repository.findAll();
        Project project = projects.get(0);

        // Is the project really in /projects
        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(project.getName())));

        // Run the delete request
        this.mockMvc.perform(delete("/projects/" + project.getId())).andDo(print());

        // Check if still there
        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(not(containsString(project.getName()))));
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
