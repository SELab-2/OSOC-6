package com.osoc6.OSOC6;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.osoc6.OSOC6.database.models.*;
import com.osoc6.OSOC6.service.ProjectService;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.TransactionSystemException;

import javax.persistence.RollbackException;
import java.util.ArrayList;
import java.util.HashSet;
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
    private ProjectService service;

    /**
     * Check if the repository accepts new projects.
     * @exception Exception throws exception if not there
     */
    @Test
    public void addNewProject() throws Exception {
        String projectName = "TEST PROJECT";
        Project testProject = new Project(projectName,
                new Edition("EDITION 2022", 2022, true),
                new HashSet<>(),
                new User("test.email", "Ruben", "Van Mello", UserRole.COACH));

        this.service.createProject(testProject);

        this.mockMvc.perform(get("/projects")).andDo(print()).andExpect(status().isOk())
                .andExpect(content().string(containsString(projectName)));
    }

    /**
     * Check if the repository throws the right errors when the fields aren't correctly set.
     * @exception Exception throws exception if not correctly set
     */
    @Test
    public void validationNewProject() throws Exception {
        Project testProject = new Project();
        String projectName = "";
        testProject.setName(projectName);
        testProject.setGoals(new ArrayList<>());
        // Validation blank name
        try {
            this.service.createProject(testProject);
            throw new Exception();
        } catch (RollbackException | TransactionSystemException ex) {
            // We should be here, RollbackException and TransactionSystemException
            // get thrown when a transaction failes because of validation
            projectName = "validation test";
            testProject.setName(projectName);
        }

        // Validation goals
        testProject.setGoals(null);
        try {
            this.service.createProject(testProject);
            throw new Exception();
        } catch (RollbackException | TransactionSystemException ex) {
            testProject.setGoals(new ArrayList<>());
        }

        this.service.createProject(testProject);

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
        newProject.setGoals(new ArrayList<>());

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
        List<Project> projects = this.service.getAll();
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
