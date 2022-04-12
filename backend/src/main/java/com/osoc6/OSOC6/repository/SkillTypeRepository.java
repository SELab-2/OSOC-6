package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.SkillType;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link SkillType},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SKILLTYPE_PATH,
        path = DumbledorePathWizard.SKILLTYPE_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface SkillTypeRepository extends JpaRepository<SkillType, Long> {
    /**
     * search by using the following: /{SKILLTYPE_PATH}/search/{SKILLTYPE_BY_NAME_PATH}?name=nameOfSkillType.
     * @param name the searched name
     * @param pageable argument needed to return a page
     * @return list of matched skillType
     */
    @RestResource(path = DumbledorePathWizard.SKILLTYPE_BY_NAME_PATH,
            rel = DumbledorePathWizard.SKILLTYPE_BY_NAME_PATH)
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    Page<SkillType> findByName(@Param("name") String name, Pageable pageable);

    @Override
    @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    Optional<SkillType> findById(@NonNull Long aLong);
}
