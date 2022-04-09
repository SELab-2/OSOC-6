package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

/**
 * This is a simple class that defines a repository for {@link Suggestion},
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SUGGESTION_PATH,
        path = DumbledorePathWizard.SUGGESTION_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    /**
     * Update/create a {@link Suggestion}.
     * @apiNote
     * An admin can update everything about every suggestion.
     * A coach can only update their own suggestions.
     */
    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or authentication.principal.id == #entity.coach.id")
    <S extends Suggestion> S save(@Param("entity") @NonNull S entity);

    /**
     * delete a {@link Suggestion}.
     * @apiNote
     * An admin can delete everything about every suggestion.
     * A coach can only delete their own suggestions.
     */
    @Override
    @PreAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or authentication.principal.id == #suggestion.coach.id")
    void delete(@Param("suggestion") @NonNull Suggestion suggestion);

    @Override @NonNull
    @PreAuthorize(MerlinSpELWizard.COACH_AUTH)
    @PostAuthorize(MerlinSpELWizard.ADMIN_AUTH + " or " + MerlinSpELWizard.USER_HAS_ACCESS_ON_OPTIONAL)
    Optional<Suggestion> findById(Long aLong);
}

