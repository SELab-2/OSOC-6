package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

/**
 * This is a simple class that defines a repository for SkillType, this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SKILLTYPE_PATH,
        path = DumbledorePathWizard.SKILLTYPE_PATH)
public interface SkillTypeRepository extends JpaRepository<SkillType, String> {
    /**
     * search by using the following: /{DumbledorePathWizard.SKILLTYPE_PATH}/search/findByName?name=nameOfSkillType.
     * @param name the searched name
     * @return list of matched skillType
     */
    List<SkillType> findByName(@Param("name") String name);
}
