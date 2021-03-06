package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.entities.SkillType;
import com.osoc6.OSOC6.repository.SkillTypeRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;

import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Class testing the integration of {@link SkillType} for an Admin.
 */
@SpringBootTest
@AutoConfigureMockMvc
public class AdminSkillTypeEndpointTests extends AdminEndpointTest<SkillType, Long, SkillTypeRepository> {

    /**
     * The repository which saves, searches, ... {@link SkillType} in the database.
     */
    @Autowired
    private SkillTypeRepository repository;

    /**
     * First sample skillTypes that gets loaded before every test.
     */
    private final SkillType skillType1 = TestEntityProvider.getBaseSkillType1(this);

    /**
     * The actual path skillPaths are served on, with '/' as prefix.
     */
    private static final String SKILLTYPES_PATH = "/" + DumbledorePathWizard.SKILLTYPE_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "a1bab8";

    public AdminSkillTypeEndpointTests() {
        super(SKILLTYPES_PATH, TEST_STRING);
    }

    @Override
    public final SkillType create_entity() {
        SkillType skillType = TestEntityProvider.getBaseSkillType2(this);
        skillType.setColour(TEST_STRING);
        return skillType;
    }

    @Override
    public final Map<String, String> change_entity(final SkillType skillType) {
        return Map.of("colour", TEST_STRING);
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
    @Override
    public void setUpRepository() {
        setupBasicData();

        repository.save(skillType1);
    }

    /**
     * Remove the two test skillTypes from the database.
     */
    @Override
    public void removeSetUpRepository() {
        removeBasicData();

        repository.deleteAll();
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void editing_final_field_is_indifferent() throws Exception {
        SkillType skillType = get_random_repository_entity();

        perform_field_patch(SKILLTYPES_PATH + "/" + skillType.getId(), "name", "\"A name is final!\"")
                .andExpect(status().isOk())
                .andExpect(content().json(Util.removeFieldsFromJson(transform_to_json(skillType), "id")));
    }

    @Test
    @WithUserDetails(value = ADMIN_EMAIL, setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void find_by_name_works() throws Exception {
        SkillType skillType = get_random_repository_entity();
        base_test_all_queried_assertions(SKILLTYPES_PATH + "/search/" + DumbledorePathWizard.SKILLTYPE_BY_NAME_PATH,
                "name", skillType.getName());
    }
}
