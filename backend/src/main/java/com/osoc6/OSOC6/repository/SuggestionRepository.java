package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Suggestion;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * This is a simple class that defines a repository for {@link Suggestion},
 * this is needed for the database.
 *
 * @author ruben
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.SUGGESTION_PATH,
        path = DumbledorePathWizard.SUGGESTION_PATH)
public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
}

