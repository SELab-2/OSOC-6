package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.UserSkill;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link UserSkill},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.USER_SKILL_PATH,
        path = DumbledorePathWizard.USER_SKILL_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    /**
     * Try to find a {@link UserSkill} by their it's id.
     */
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !returnObject.present or "
            + " @spelUtil.hasOverlappingEditions(authentication.principal, returnObject.get.userEntity)")
    Optional<UserSkill> findById(@NonNull Long id);

    /**
     * Update a {@link UserSkill}.
     */
    @Override
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH
            + " or (#userSkill.userEntity != null and authentication.principal.id == #userSkill.userEntity.id)")
    @NonNull
    <S extends UserSkill> S save(@NonNull S userSkill);

    @Override
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or !@userSkillRepository.findById(#skillId).present or "
        + "authentication.principal.id == @userSkillRepository.findById(#skillId).get.userEntity.id")
    void deleteById(@NonNull Long skillId);
}
