package com.osoc6.OSOC6;

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
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link SkillType}.
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SkillTypeTests extends EndpointTest<SkillType, SkillTypeRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private SkillTypeRepository repository;

    /**
     * First sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType1 = new SkillType("skillType 1");

    /**
     * Second sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType2 = new SkillType("skillType 2");

    /**
     * The actual path skillPaths are served on, with '/' as prefix.
     */
    private static final String SKILLTYPES_PATH = "/" + DumbledorePathWizard.SKILLTYPE_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "a1bab8";

    public SkillTypeTests() {
        super(SKILLTYPES_PATH, TEST_STRING);
    }

    @Override
    public final SkillType create_entity() {
        SkillType skillType = new SkillType("New skillType Name");
        skillType.setColour(TEST_STRING);
        return skillType;
    }

    @Override
    public final SkillType change_entity(final SkillType skillType) {
        SkillType changedSkillType = new SkillType(skillType.getName());
        changedSkillType.setColour(TEST_STRING);
        return changedSkillType;
    }

    @Override
    public final SkillTypeRepository get_repository() {
        return repository;
    }

    @Override
    public final Long get_id(final SkillType entity) {
        return entity.getId();
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
        if (repository.existsById(skillType1.getId())) {
            repository.deleteById(skillType1.getId());
        }
        if (repository.existsById(skillType2.getId())) {
            repository.deleteById(skillType2.getId());
        }
    }

    @Test
    @WithMockUser(username = "admin", authorities = {"ADMIN"})
    public void editing_final_field_is_indifferent() throws Exception {
        List<SkillType> skillTypes = repository.findAll();
        SkillType skillType = skillTypes.get(0);

        perform_field_patch(SKILLTYPES_PATH + "/" + skillType.getId(), "name", "\"A name is final!\"")
                .andExpect(status().isOk())
                .andExpect(content().json(Util.asJsonStringExcludingFields(skillType, "id")));
    }
}
