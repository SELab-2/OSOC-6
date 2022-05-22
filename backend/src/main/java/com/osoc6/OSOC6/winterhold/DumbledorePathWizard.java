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
     * Path that {@link com.osoc6.OSOC6.entities.Edition} is served on.
     */
    public static final String EDITIONS_PATH = "editions";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Edition} is served on.
     */
    public static final String EDITIONS_BY_NAME_PATH = "by-name";

    /**
     * Path that queries over {@link com.osoc6.OSOC6.entities.Edition} id are served on.
     */
    public static final String FIND_ANYTHING_BY_EDITION_PATH = "by-edition";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.SkillType} is served on.
     */
    public static final String SKILLTYPE_PATH = "skillTypes";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.SkillType} is served on.
     */
    public static final String SKILLTYPE_BY_NAME_PATH = "by-name";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.UserEntity} is served on.
     */
    public static final String USERS_PATH = "users";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.UserEntity} is served on.
     */
    public static final String USERS_BY_EMAIL_PATH = "by-email";

    /**
     * Path that query for own user {@link com.osoc6.OSOC6.entities.UserEntity} is served on.
     */
    public static final String OWN_USERS_PATH = "own-user";

    /**
     * Path used to request a password reset.
     */
    public static final String FORGOT_PASSWORD_PATH = "forgot-password";

    /**
     * Path used to actually reset the password.
     */
    public static final String RESET_PASSWORD_PATH = "reset-password";

    /**
     * Path that registration is served on.
     */
    public static final String REGISTRATION_PATH = "registration";

    /**
     * Path for authentication. (Spring security uses this path internally)
     */
    public static final String AUTH_PATH = "auth";

    /**
     * Path for failed authentication backend. (Spring security uses this path internally)
     */
    public static final String AUTH_FAIL_PATH = "login?error";

    /**
     * Path for logging in to the backend. (Spring security uses this path internally. It's a default path)
     */
    public static final String LOGIN_PATH = "login";

    /**
     * Path that login processing is served on.
     */
    public static final String LOGIN_PROCESSING_PATH = "login";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_PATH = "communicationTemplates";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_BY_NAME_PATH = "by-name";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Project} is served on.
     */
    public static final String PROJECTS_PATH = "projects";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Invitation} is served on.
     */
    public static final String INVITATIONS_PATH = "invitations";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Invitation} is served on.
     */
    public static final String INVITATION_BY_TOKEN_PATH = "by-token";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Suggestion} is served on.
     */
    public static final String SUGGESTION_PATH = "suggestions";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.UserSkill} is served on.
     */
    public static final String USER_SKILL_PATH = "user-skills";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.ProjectSkill} is served on.
     */
    public static final String PROJECT_SKILL_PATH = "project-skills";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Communication} is served on.
     */
    public static final String COMMUNICATION_PATH = "communications";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Communication} is served on.
     */
    public static final String COMMUNICATION_BY_STUDENT_PATH = "by-student";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Assignment} is served on.
     */
    public static final String ASSIGNMENT_PATH = "assignments";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Assignment} valid on student is served on.
     */
    public static final String ASSIGNMENT_VALID_OF_STUDENT_PATH = "validity-on-student";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.Assignment} valid on project is served on.
     */
    public static final String ASSIGNMENT_VALID_OF_PROJECT_SKILL_PATH = "validity-on-project-skill";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.student.Student} is served on.
     */
    public static final String STUDENT_PATH = "students";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.student.Student} query is served on.
     */
    public static final String STUDENT_QUERY_PATH = "full-query";

    /**
     * Path that {@link com.osoc6.OSOC6.entities.student.Student} conflict query is served on.
     */
    public static final String STUDENT_CONFLICT_PATH = "conflict-query";

    /**
     * Path that our webhook is served on.
     */
    public static final String WEBHOOK_PATH = "webhook";
}
