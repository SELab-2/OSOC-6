package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserSkill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for {@link UserSkill},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.USER_SKILL_PATH,
        path = DumbledorePathWizard.USER_SKILL_PATH)
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
}
