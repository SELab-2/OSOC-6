package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.Edition;
import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.repository.SkillTypeRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link SkillType}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SkillTypeTests {
    /**
     * This mocks the server without starting it.
     */
    @Autowired
    private MockMvc mockMvc;

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private SkillTypeRepository repository;

    /**
     * First sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType1 = new SkillType("skillType 1", "42B37B");

    /**
     * Second sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType2 = new SkillType("skillType 2", "C94040");

    /**
     * An illegal string id.
     */
    private static final String ILLEGAL_NAME = "Some very illegal name";

    /**
     * The actual path skillPaths are served on, with '/' as prefix.
     */
    private static final String SKILLTYPES_PATH = "/" + DumbledorePathWizard.SKILLTYPE_PATH;

    /**
     * Add two test skillTypes to the database.
     */
    @BeforeEach
    public void setUp() {
        skillType1.setColour("42B37B");
        repository.save(skillType1);

        skillType2.setColour("C94040");
        repository.save(skillType2);
    }

    /**
     * Remove the two test skillTypes from the database.
     */
    @AfterEach
    public void removeTestSkillTypes() {
        if (repository.existsById(skillType1.getName())) {
            repository.deleteById(skillType1.getName());
        }
        if (repository.existsById(skillType2.getName())) {
            repository.deleteById(skillType2.getName());
        }
    }

    /**
     * Check if the repository accepts new skillType.
     * @exception Exception throws exception if not there
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void add_new_skillType() throws Exception {
        String skillTypeName = "posted skilltype";
        SkillType newSkillType = new SkillType(skillTypeName, "80c958");

        repository.save(newSkillType);

        mockMvc.perform(get(SKILLTYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillTypeName)));
    }

    /**
     * Check if we can add an skillType via a POST request.
     * @exception Exception throws exception if not there
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void post_new_skillType() throws Exception {
        String skillTypeName = "standing on hands";
        SkillType newSkillType = new SkillType(skillTypeName, "191616");

        mockMvc.perform(post(SKILLTYPES_PATH)
                .content(Util.asJsonString(newSkillType))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(get(SKILLTYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillTypeName)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void post_garbage_skillType_fails() throws Exception {
        Edition edition = new Edition();
        edition.setName("Some edition name");
        edition.setActive(false);
        edition.setYear(2022);

        mockMvc.perform(post(SKILLTYPES_PATH)
                .content(Util.asJsonString(edition))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError());
    }

    /**
     * Check if we can delete a skillType via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_skillType() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        // Is the skillType really in /skillTypes
        mockMvc.perform(get(SKILLTYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillType.getName())));

        // Run the delete request
        mockMvc.perform(delete(SKILLTYPES_PATH + "/" + skillType.getName()));

        // Check if still there
        if (repository.existsById(skillType.getName())) {
            throw new Exception();
        }

    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_skillType_throws_not_fount() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        // Is the skillType really in /skillTypes
        mockMvc.perform(get(SKILLTYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillType.getName())));

        // Run the delete request
        mockMvc.perform(delete(SKILLTYPES_PATH + "/" + skillType.getName()));

        // A 404 is enough here
        mockMvc.perform(delete(SKILLTYPES_PATH + "/" + skillType.getName()))
                .andExpect(status().isNotFound())
                .andExpect(content().string(not(emptyString())));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void getting_illegal_skillType_fails() throws Exception {
        // A 404 is descriptive enough.
        mockMvc.perform(get(SKILLTYPES_PATH + "/" + ILLEGAL_NAME))
                .andExpect(status().isNotFound()).andExpect(content().string(not(emptyString())));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void patching_illegal_skillType_fails() throws Exception {
        SkillType newSkillType = new SkillType(ILLEGAL_NAME, "DF7E5C");

        // A 404 is descriptive enough here.
        mockMvc.perform(patch(SKILLTYPES_PATH + "/" + newSkillType.getName())
                        .content(Util.asJsonString(newSkillType))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()).andExpect(content().string(not(emptyString())));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void edit_skillType_colour() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        String newColour = "DF7E5B";
        skillType.setColour(newColour);

        mockMvc.perform(patch(SKILLTYPES_PATH + "/" + skillType.getName())
                .content(Util.asJsonString(skillType))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(get(SKILLTYPES_PATH + "/" + skillType.getName()))
                .andExpect(status().isOk())
                .andExpect(content().string(Util.containsFieldWithValue("colour", newColour)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void editing_final_field_is_indifferent() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        String newName = "A name is final!";
        SkillType newSkillType = new SkillType(newName, skillType.getColour());

        mockMvc.perform(patch(SKILLTYPES_PATH + "/" + skillType.getName())
                .content(Util.asJsonString(newSkillType))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)).andDo(print())
                .andExpect(content().json(Util.asJsonString(skillType)));
    }
}
