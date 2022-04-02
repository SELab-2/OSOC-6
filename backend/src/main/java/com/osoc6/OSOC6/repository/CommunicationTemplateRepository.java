package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.CommunicationTemplate;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import javax.transaction.Transactional;
import java.util.List;

/**
 * This is a simple class that defines a repository for {@link CommunicationTemplate},
 * this is needed for the database.
 *
 * @author jitsedesmet
 */
@RepositoryRestResource(collectionResourceRel = DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH,
        path = DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH)
public interface CommunicationTemplateRepository extends JpaRepository<CommunicationTemplate, Long> {
    /**
     * search by using the following:
     * /{DumbledorePathWizard.COMMUNICATION_TEMPLATE_PATH}/search/findByName?name=nameOfCommunicationTemplate.
     * @param name the searched name
     * @return list of matched communicationTemplates
     */
    @Transactional
    List<CommunicationTemplate> findByName(@Param("name") String name);
}
