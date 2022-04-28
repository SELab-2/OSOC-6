package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.Communication;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link Communication},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.COMMUNICATION_PATH,
        path = DumbledorePathWizard.COMMUNICATION_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface CommunicationRepository extends JpaRepository<Communication, Long> {
    /**
     * Get all communication with a student.
     * @param studentId the id of the student from whom we want the communication
     * @param pageable argument needed to return a page
     * @return list of matched {@link Communication}
     */
    @RestResource(path = DumbledorePathWizard.COMMUNICATION_BY_STUDENT_PATH,
            rel = DumbledorePathWizard.COMMUNICATION_BY_STUDENT_PATH)
    Page<Communication> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);
}
