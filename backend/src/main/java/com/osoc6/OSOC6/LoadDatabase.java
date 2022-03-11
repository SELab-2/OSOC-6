package com.osoc6.OSOC6;


import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.repository.ProjectRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadDatabase {

    /**
    * Logger to display messages in console.
    */
    private static final Logger LOGGER = LoggerFactory.getLogger(LoadDatabase.class);

    /**
     * A bean gets run automatically when springboot runs.
     * This populates the project table.
     * @param repository the project repository
     * @return a commandline runner
     */
    @Bean
    CommandLineRunner initDatabaseProject(final ProjectRepository repository) {

        return args -> {
            LOGGER.info("Preloading OSOC 1");
            Project osoc1 = new Project();
            osoc1.setName("OSOC 1");
            repository.save(osoc1);

            LOGGER.info("Preloading OSOC 2");
            Project osoc2 = new Project();
            osoc2.setName("OSOC 2");
            repository.save(osoc2);
        };
    }

}
