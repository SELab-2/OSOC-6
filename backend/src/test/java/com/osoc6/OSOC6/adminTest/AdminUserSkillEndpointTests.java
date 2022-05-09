package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.TestEntityProvider;
import com.osoc6.OSOC6.Util;
import com.osoc6.OSOC6.entities.UserSkill;
import com.osoc6.OSOC6.dto.UserSkillDTO;
import com.osoc6.OSOC6.repository.UserSkillRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.server.EntityLinks;

import java.util.Map;

/**
 * Class testing the integration of {@link UserSkill} as an admin.
 */
public final class AdminUserSkillEndpointTests extends AdminEndpointTest<UserSkill, Long, UserSkillRepository> {

    /**
     * The repository which saves, searches, ... {@link UserSkill} in the database.
     */
    @Autowired
    private UserSkillRepository userSkillRepository;

    /**
     * Entity links, needed to get the link of an entity.
     */
    @Autowired
    private EntityLinks entityLinks;

    /**
     * Sample UserSkill that gets loaded before every test.
     */
    private final UserSkill testSkill = TestEntityProvider.getBaseAdminUserSkill(this);

    /**
     * The actual path users are served on, with '/' as prefix.
     */
    private static final String USER_SKILL_PATH = "/" + DumbledorePathWizard.USER_SKILL_PATH;

    /**
     * The string that will be set on a POST or PATCH and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Smart as an owl and a dolphin combined";

    public AdminUserSkillEndpointTests() {
        super(USER_SKILL_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final UserSkill entity) {
        return entity.getId();
    }

    @Override
    public UserSkillRepository get_repository() {
        return userSkillRepository;
    }

    @Override
    public void setUpRepository() {
        setupBasicData();

        userSkillRepository.save(testSkill);
    }

    @Override
    public void removeSetUpRepository() {
        userSkillRepository.deleteAll();

        removeBasicData();
    }

    @Override
    public UserSkill create_entity() {
        UserSkill skill = TestEntityProvider.getBaseCoachUserSkill(this);
        skill.setName(TEST_STRING);
        return skill;
    }

    @Override
    public Map<String, String> change_entity(final UserSkill startEntity) {
        return Map.of("name", TEST_STRING);
    }

    @Override
    public String transform_to_json(final UserSkill entity) {
        UserSkillDTO skillDTO = new UserSkillDTO(entity, entityLinks);
        return Util.asJsonString(skillDTO);
    }
}
