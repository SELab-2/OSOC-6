package com.osoc6.OSOC6.winterhold;

/**
 * The {@link DumbledorePathWizard} is a wizard that helps us in the noble quest to not use paths ourselves.
 * Whenever a path is needed we will ask DumbledorePathWizard to cast a spell creating the path.
 * DumbledorePathWizard will remind us of what we should use the paths for.
 */
public final class DumbledorePathWizard {

    /**
     * Constructor of class, does nothing. Makes sure this is a util class.
     */
    private DumbledorePathWizard() { }

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Edition} is served on.
     */
    public static final String EDITIONS_PATH = "editions";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.SkillType} is served on.
     */
    public static final String SKILLTYPE_PATH = "skillType";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String USERS_PATH = "users";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_PATH = "communicationTemplates";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Organisation} is served on.
     */
    public static final String ORGANISATIONS_PATH = "organisations";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Project} is served on.
     */
    public static final String PROJECTS_PATH = "projects";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Invitation} is served on.
     */
    public static final String INVITATIONS_PATH = "invitations";
}
