package com.osoc6.OSOC6;

import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.dto.SkillTypeDTO;
import com.osoc6.OSOC6.repository.SkillTypeRepository;
import com.osoc6.OSOC6.service.SkillTypeService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
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
     * Service which is the connection to the database for skillTypes via a repository.
     */
    @Autowired
    private SkillTypeService service;

    /**
     * First sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType1 = new SkillType("skillType 1", "42B37B");

    /**
     * Second sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType2 = new SkillType("skillType 2", "C94040");

    private static final String SKILL_TYPES_PATH = "/skillTypes";

    private static String getNotFountMessage(final String id) {
        return "Could not find skillType identified by " + id + ".";
    }

    private static String getIllegalEditException(final String field) {
        return "Field " + field + " is not editable in SkillType.";
    }

    private static final String ILLEGAL_NAME = "Some very illegal name";

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
     * Check if we can add an skillType via a POST request.
     * @exception Exception throws exception if not there
     */
    @Test
    @Disabled
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void post_new_skillType() throws Exception {
        String skillTypeName = "standing on hands";
        SkillTypeDTO dto = new SkillTypeDTO();
        dto.setName(skillTypeName);
        dto.setColour("191616");

        mockMvc.perform(post(SKILL_TYPES_PATH)
                .content(Util.asJsonString(dto))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(get(SKILL_TYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillTypeName)));
    }

    /**
     * Check if we can delete a skillType via a DELETE request.
     * @exception Exception throws exception if not deleted
     */
    @Test
    @Disabled
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_skillType() throws Exception {
        List<SkillType> skillTypes = service.getAll();
        SkillType skillType = skillTypes.get(0);

        // Is the skillType really in /skillTypes
        mockMvc.perform(get(SKILL_TYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillType.getName())));

        // Run the delete request
        mockMvc.perform(delete(SKILL_TYPES_PATH + "/" + skillType.getName()));

        // Check if still there
        if (repository.existsById(skillType.getName())) {
            throw new Exception();
        }

    }

    @Test
    @Disabled
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void delete_skillType_throws_not_fount() throws Exception {
        List<SkillType> skillTypes = service.getAll();
        SkillType skillType = skillTypes.get(0);

        // Is the skillType really in /skillTypes
        mockMvc.perform(get(SKILL_TYPES_PATH)).andExpect(status().isOk())
                .andExpect(content().string(containsString(skillType.getName())));

        // Run the delete request
        mockMvc.perform(delete(SKILL_TYPES_PATH + "/" + skillType.getName()));

        mockMvc.perform(delete(SKILL_TYPES_PATH + "/" + skillType.getName()))
                .andExpect(content().string(containsString(getNotFountMessage(skillType.getName()))));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void getting_illegal_skillType_fails() throws Exception {
        mockMvc.perform(get(SKILL_TYPES_PATH + "/" + ILLEGAL_NAME))
                .andExpect(content().string(containsString(getNotFountMessage(ILLEGAL_NAME))));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void patching_illegal_skillType_fails() throws Exception {
        SkillTypeDTO dto = new SkillTypeDTO();
        dto.setName(ILLEGAL_NAME);
        dto.setColour("DF7E5C");
        mockMvc.perform(patch(SKILL_TYPES_PATH + "/" + dto.getName())
                        .content(Util.asJsonString(dto))
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(content().string(containsString(getNotFountMessage(ILLEGAL_NAME))));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void edit_skillType_colour() throws Exception {
        List<SkillType> skillTypes = service.getAll();
        SkillType skillType = skillTypes.get(0);

        SkillTypeDTO dto = SkillTypeDTO.fromEntity(skillType);

        String newColour = "DF7E5B";
        dto.setColour(newColour);

        mockMvc.perform(patch(SKILL_TYPES_PATH + "/" + dto.getName())
                .content(Util.asJsonString(dto))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON));

        mockMvc.perform(get(SKILL_TYPES_PATH + "/" + dto.getName())).andExpect(status().isOk())
                .andExpect(content().string(Util.containsFieldWithValue("colour", newColour)));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void editing_final_field_fails() throws Exception {
        List<SkillType> skillTypes = service.getAll();
        SkillType skillType = skillTypes.get(0);

        SkillTypeDTO dto = SkillTypeDTO.fromEntity(skillType);

        String newName = "A name is final!";
        dto.setName(newName);

        mockMvc.perform(patch(SKILL_TYPES_PATH + "/" + skillType.getName())
                .content(Util.asJsonString(dto))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)).andDo(print())
                .andExpect(content().string(containsString(getIllegalEditException("name"))));
    }
}
