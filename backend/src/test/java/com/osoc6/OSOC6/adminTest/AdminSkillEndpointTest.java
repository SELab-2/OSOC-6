package com.osoc6.OSOC6.adminTest;

import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.repository.SkillRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashMap;
import java.util.Map;

/**
 * Class testing the integration of {@link Skill} with admin privileges.
 */
public final class AdminSkillEndpointTest extends AdminEndpointTest<Skill, Long, SkillRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private SkillRepository repository;

    /**
     * First sample edition that gets loaded before every test.
     */
    private final Skill skill = new Skill();

    /**
     * The actual path editions are served on, with '/' as prefix.
     */
    private static final String SKILLS_PATH = "/" + DumbledorePathWizard.SKILL_PATH;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "Standing on hands";

    public AdminSkillEndpointTest() {
        super(SKILLS_PATH, TEST_STRING);
    }

    @Override
    public Long get_id(final Skill entity) {
        return entity.getId();
    }

    @Override
    public SkillRepository get_repository() {
        return repository;
    }

    @Override
    public void setUpRepository() {
        skill.setName("Functional programming");
        skill.setAdditionalInfo("I have a thing for lambda's");
        repository.save(skill);
    }

    @Override
    public void removeSetUpRepository() {
        if (repository.existsById(skill.getId())) {
            repository.deleteById(skill.getId());
        }
    }

    @Override
    public Skill create_entity() {
        return new Skill(TEST_STRING,
                "Standing on hands makes me see the world from a different perspective");
    }

    @Override
    public Map<String, String> change_entity(final Skill startEntity) {
        Map<String, String> changeMap = new HashMap<>();
        changeMap.put("name", TEST_STRING);
        return changeMap;
    }
}
