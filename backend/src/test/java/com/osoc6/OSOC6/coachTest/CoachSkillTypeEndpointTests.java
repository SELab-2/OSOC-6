package com.osoc6.OSOC6.coachTest;


import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.repository.SkillTypeRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link SkillType} for a coach.
 */
@SpringBootTest
@AutoConfigureMockMvc
public final class CoachSkillTypeEndpointTests extends TestFunctionProvider<SkillType, Long, SkillTypeRepository> {

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

    public CoachSkillTypeEndpointTests() {
        super(SKILLTYPES_PATH, TEST_STRING);
    }

    @Override
    public SkillType create_entity() {
        SkillType skillType = new SkillType("New skillType Name");
        skillType.setColour(TEST_STRING);
        return skillType;
    }

    @Override
    public Map<String, String> change_entity(final SkillType startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("colour", TEST_STRING);
        return changeMap;
    }

    @Override
    public SkillTypeRepository get_repository() {
        return repository;
    }

    @Override
    public Long get_id(final SkillType entity) {
        return entity.getId();
    }

    /**
     * Add two test skillTypes to the database.
     */
    @Override
    public void setUpRepository() {
        skillType1.setColour("42B37B");
        repository.save(skillType1);

        skillType2.setColour("C94040");
        repository.save(skillType2);
    }

    /**
     * Remove the two test skillTypes from the database.
     */
    @Override
    public void removeSetUpRepository() {
        if (repository.existsById(skillType1.getId())) {
            repository.deleteById(skillType1.getId());
        }
        if (repository.existsById(skillType2.getId())) {
            repository.deleteById(skillType2.getId());
        }
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void find_by_name_works() throws Exception {
        SkillType skillType = get_random_repository_entity();
        base_test_all_queried_assertions(
                SKILLTYPES_PATH + "/search/findByName", "name", skillType.getName());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void post_new_skilltype_fails() throws Exception {
        SkillType entity = create_entity();
        perform_post(SKILLTYPES_PATH, entity).andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void delete_skilltype_fails() throws Exception {
        SkillType entity = get_random_repository_entity();
        perform_delete_with_id(SKILLTYPES_PATH, entity.getId())
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_legal_entity_succeeds() throws Exception {
        base_getting_legal_entity_succeeds();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_skilltype_fails() throws Exception {
        SkillType entity = get_random_repository_entity();

        Map<String, String> patchMap = new HashMap<>();
        patchMap.put("colour", TEST_STRING);

        perform_patch(SKILLTYPES_PATH + "/" + entity.getId(), patchMap)
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_illegal_entity_fails() throws Exception {
        base_getting_illegal_entity_fails();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void getting_illegal_entity_fails_name() throws Exception {
        base_getting_illegal_entity_fails_name();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_entity_to_illegal_id_fails() throws Exception {
        base_patching_entity_to_illegal_id_fails();
    }

    @Test
    @WithMockUser(username = "coach", authorities = {"COACH"})
    public void patching_entity_to_illegal_string_id_fails() throws Exception {
        base_patching_entity_to_illegal_string_id_fails();
    }
}
