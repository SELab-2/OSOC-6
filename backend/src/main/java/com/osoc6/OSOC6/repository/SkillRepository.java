package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Skill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


/**
 * This is a simple class that defines a repository for {@link Skill},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SKILL_PATH,
        path = DumbledorePathWizard.SKILL_PATH)
public interface SkillRepository extends JpaRepository<Skill, Long> {
    // Coaches only get to see skills that are within the edition they see.
}
