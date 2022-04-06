package com.osoc6.OSOC6.coachTest;

import com.osoc6.OSOC6.TestFunctionProvider;
import com.osoc6.OSOC6.database.models.Project;
import com.osoc6.OSOC6.repository.ProjectRepository;
import com.osoc6.OSOC6.winterhold.DumbledorePathWizard;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;

public class CoachProjectEndpointTests extends TestFunctionProvider<Project, Long, ProjectRepository> {

    /**
     * The repository which saves, searches, ... in the database
     */
    @Autowired
    private ProjectRepository repository;

    /**
     * The string that will be set on a patch and will be looked for.
     * This string should be unique.
     */
    private static final String TEST_STRING = "A unique new project name!";

    /**
     * The actual path projects are served on, with '/' as prefix.
     */
    private static final String PROJECT_PATH = "/" + DumbledorePathWizard.PROJECTS_PATH;

    public CoachProjectEndpointTests() {
        super(PROJECT_PATH, TEST_STRING);
    }

    @Override
    public final Long get_id(final Project entity) {
        return entity.getId();
    }

    @Override
    public final ProjectRepository get_repository() {
        return repository;
    }

    @Override
    public void setUpRepository() {

    }

    @Override
    public void removeSetUpRepository() {

    }

    @Override
    public final Project create_entity() {
        return null;
    }

    @Override
    public final Map<String, String> change_entity(final Project startEntity) {
        return null;
    }
}
