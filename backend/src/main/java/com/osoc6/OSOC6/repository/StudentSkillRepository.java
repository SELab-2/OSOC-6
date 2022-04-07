package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.student.StudentSkill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for {@link StudentSkill},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.STUDENT_SKILL_PATH,
        path = DumbledorePathWizard.STUDENT_SKILL_PATH)
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
}
