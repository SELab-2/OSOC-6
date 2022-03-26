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

import java.util.List;

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
public class SkillTypeTests extends EndpointTest<SkillType, SkillTypeRepository, String> {

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
     * The actual path skillPaths are served on, with '/' as prefix.
     */
    private static final String SKILLTYPES_PATH = "/" + DumbledorePathWizard.SKILLTYPE_PATH;

    public SkillTypeTests() {
        super(SKILLTYPES_PATH, "SkillType");
    }

    @Override
    public final SkillType create_entity() {
        String skillTypeName = "SkillType";
        return new SkillType(skillTypeName, "80c958");
    }

    @Override
    public final SkillTypeRepository get_repository() {
        return repository;
    }

    @Override
    public final String get_id(final SkillType entity) {
        return entity.getName();
    }

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

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void edit_skillType_colour() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        String newColour = "DF7E5B";
        skillType.setColour(newColour);

        perform_patch(SKILLTYPES_PATH + "/" + skillType.getName(), skillType);

        perform_get(SKILLTYPES_PATH + "/" + skillType.getName())
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

        perform_patch(SKILLTYPES_PATH + "/" + skillType.getName(), newSkillType)
                .andDo(print())
                .andExpect(content().json(Util.asJsonString(skillType)));
    }

    /**
     * Override this method because the id is a string.
     * @throws Exception throws error if checks fail
     */
    @Override
    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    public void getting_illegal_entity_fails_name() throws Exception {
        perform_get(SKILLTYPES_PATH + "/" + "Some very illegal name")
                .andExpect(status().isNotFound())
                .andExpect(string_not_empty());
    }
}
