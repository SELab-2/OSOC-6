package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import lombok.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
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
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {

    /**
     * Update a {@link Suggestion}.
     * @apiNote
     * An admin can update everything about every suggestion.
     * A coach can only update their own suggestions.
     */
    @Override
    @PreAuthorize("hasAuthority('ADMIN') or authentication.principal.id == #suggestion.coach.id")
    @NonNull
    <S extends Suggestion> S save(@NonNull S suggestion);
}

