package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link com.osoc6.OSOC6.database.models.Skill},
 * this is needed for the database.
 * Even though Search by name seems beneficial at first, it isn't implemented because skill is referenced by:
 * Student, project and coach.
 * Looking for a skill by its name isn't interesting if we can not differentiate between these cases.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SKILL_PATH,
        path = DumbledorePathWizard.SKILL_PATH)
public interface SkillRepository extends JpaRepository<Skill, Long> {
}
