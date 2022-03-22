package com.osoc6.OSOC6.repository;

import com.osoc6.OSOC6.database.models.SkillType;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

/**
 * A class configuring the repository.
 */
@Component
public class RepositoryConfig implements RepositoryRestConfigurer {
    /**
     * Function configuring the REST API.
     * @param config the configuration.
     * @param cors Cross-origin resource sharing registry.
     */
    @Override
    public void configureRepositoryRestConfiguration(final RepositoryRestConfiguration config,
                                                     final CorsRegistry cors) {
        config.exposeIdsFor(SkillType.class);
    }
}
