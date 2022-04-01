package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link SkillType},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SKILLTYPE_PATH,
        path = DumbledorePathWizard.SKILLTYPE_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface SkillTypeRepository extends JpaRepository<SkillType, Long> {
    /**
     * search by using the following: /{DumbledorePathWizard.SKILLTYPE_PATH}/search/findByName?name=nameOfSkillType.
     * @param name the searched name
     * @return list of matched skillType
     */
    @PreAuthorize("hasAnyAuthority('COACH')")
    List<SkillType> findByName(@Param("name") String name);

    @Override
    @NonNull
    @PreAuthorize("hasAnyAuthority('COACH')")
    Optional<SkillType> findById(@NonNull Long aLong);
}
