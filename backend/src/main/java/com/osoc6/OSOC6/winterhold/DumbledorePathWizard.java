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
    public static final String SKILLTYPE_PATH = "skillTypes";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String USERS_PATH = "users";

    /**
     * Path that query for own user {@link com.osoc6.OSOC6.database.models.UserEntity} is served on.
     */
    public static final String OWN_USERS_PATH = "own-user";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.CommunicationTemplate} is served on.
     */
    public static final String COMMUNICATION_TEMPLATE_PATH = "communicationTemplates";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Project} is served on.
     */
    public static final String PROJECTS_PATH = "projects";

    /**
     * Path that {@link com.osoc6.OSOC6.database.models.Invitation} is served on.
     */
    public static final String INVITATIONS_PATH = "invitations";

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
}
