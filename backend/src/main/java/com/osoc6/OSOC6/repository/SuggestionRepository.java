package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link Suggestion},
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SUGGESTION_PATH,
        path = DumbledorePathWizard.SUGGESTION_PATH)
@PreAuthorize("hasAuthority('ADMIN')")
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    /**
     * Update/create a {@link Suggestion}.
     * @apiNote
     * An admin can update everything about every suggestion.
     * A coach can only update their own suggestions.
     */
    @Override
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('COACH') "
            + "and authentication.principal.username == #suggestion.coach.email)")
    @NonNull
    <S extends Suggestion> S save(@Param("suggestion") @NonNull S suggestion);

    /**
     * delete a {@link Suggestion}.
     * @apiNote
     * An admin can delete everything about every suggestion.
     * A coach can only delete their own suggestions.
     */
    @Override
    @PreAuthorize("hasAuthority('ADMIN') or (hasAuthority('COACH') "
            + "and authentication.principal.username == #suggestion.coach.email)")
    void delete(@Param("suggestion") @NonNull Suggestion suggestion);

    @Override
    @NonNull
    @PreAuthorize("hasAnyAuthority('ADMIN', 'COACH')")
    Page<Suggestion> findAll(@NonNull Pageable pageable);
}

