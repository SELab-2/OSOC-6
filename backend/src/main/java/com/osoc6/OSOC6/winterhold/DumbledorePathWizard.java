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
     * Path that {@link com.osoc6.OSOC6.database.models.Edition} is served on.
     */
    public static final String EDITIONS_BY_NAME_PATH = "by-name";

    /**
     * Path that queries over {@link com.osoc6.OSOC6.database.models.Edition} id are served on.
     */
    public static final String FIND_ANYTHING_BY_EDITION_PATH = "by-edition";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.SkillType} is served on.
     */
    public static final String SKILLTYPE_PATH = "skillTypes";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.SkillType} is served on.
     */
    public static final String SKILLTYPE_BY_NAME_PATH = "by-name";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String USERS_PATH = "users";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String USERS_BY_EMAIL_PATH = "by-email";

    /**
     * Path that query for own user {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String OWN_USERS_PATH = "own-user";

    /**
     * Path that registration is served on.
     */
    public static final String REGISTRATION_PATH = "registration";

    /**
     * Path for authentication. (Spring security uses this path internally)
     */
    public static final String AUTH_PATH = "auth";

    /**
     * Path for successful authentication backend. (Spring security uses this path internally)
     */
    public static final String AUTH_HOME_PATH = "home";

    /**
     * Path for failed authentication backend. (Spring security uses this path internally)
     */
    public static final String AUTH_FAIL_PATH = "failure";

    /**
     * Path for logging in to the backend. (Spring security uses this path internally. It's a default path)
     */
    public static final String LOGIN_PATH = "login";

    /**
     * Path that login processing is served on.
     */
    public static final String LOGIN_PROCESSING_PATH = "login-processing";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_PATH = "communicationTemplates";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_BY_NAME_PATH = "by-name";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Project} is served on.
     */
    public static final String PROJECTS_PATH = "projects";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Invitation} is served on.
     */
    public static final String INVITATIONS_PATH = "invitations";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Invitation} is served on.
     */
    public static final String INVITATION_BY_TOKEN_PATH = "by-token";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Suggestion} is served on.
     */
    public static final String SUGGESTION_PATH = "suggestions";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserSkill} is served on.
     */
    public static final String USER_SKILL_PATH = "user-skills";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserSkill} is served on.
     */
    public static final String PROJECT_SKILL_PATH = "project-skills";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Communication} is served on.
     */
    public static final String COMMUNICATION_PATH = "communications";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Communication} is served on.
     */
    public static final String COMMUNICATION_BY_STUDENT_PATH = "by-student";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Assignment} is served on.
     */
    public static final String ASSIGNMENT_PATH = "assignments";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.student.Student} is served on.
     */
    public static final String STUDENT_PATH = "students";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.student.Student} query is served on.
     */
    public static final String STUDENT_QUERY_PATH = "full-query";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.student.Student} conflict query is served on.
     */
    public static final String STUDENT_CONFLICT_PATH = "conflict-query";

    /**
     * Path that our webhook is served on.
     */
    public static final String WEBHOOK_PATH = "webhook";
}
