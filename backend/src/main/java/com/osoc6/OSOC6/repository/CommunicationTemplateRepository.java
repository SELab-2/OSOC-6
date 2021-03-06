package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.entities.CommunicationTemplate;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import com.osoc6.OSOC6.winterhold.MerlinSpELWizard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.security.access.prepost.PreAuthorize;

/**
 * This is a simple class that defines a repository for {@link CommunicationTemplate},
 * this is needed for the database.
 * Coaches don't get access to this resource since they are unable to track communication from within the tool.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH,
        path = DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH)
@PreAuthorize(MerlinSpELWizard.ADMIN_AUTH)
public interface CommunicationTemplateRepository extends JpaRepository<CommunicationTemplate, Long> {
    /**
     * search by using the following:
     * /{COMMUNICATION_TEMPLATE_PATH}/search/{COMMUNICATION_TEMPLATE_BY_NAME_PATH}?name=nameOfCommunicationTemplate.
     * @param name the searched name
     * @param pageable argument needed to return a page
     * @return list of matched communicationTemplates
     */
    @RestResource(path = DumbledorePathWizard.COMMUNICATION_TEMPLATE_BY_NAME_PATH,
            rel = DumbledorePathWizard.COMMUNICATION_TEMPLATE_BY_NAME_PATH)
    @Query("select c from CommunicationTemplate c where UPPER(c.name) = UPPER(:#{@spelUtil.safeString(#name)})")
    Page<CommunicationTemplate> findByName(@Param("name") String name, Pageable pageable);
}
