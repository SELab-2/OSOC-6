/**
 * The paths used by our api.
 */
const apiPaths = {
    base: "http://localhost/api/",

    loginRedirect: "login",
    login: "login-processing",
    registration: "registration",
    loginError: "loginError",
    logout: "logout",

    forgotPassword: "forgot-password",
    resetPassword: "reset-password",

    editions: "editions",
    editionByName: "editions/search/by-name",

    skillTypes: "skillTypes",
    skillTypesByName: "skillTypes/search/by-name",

    users: "users",
    ownUser: "users/search/own-user",
    userByEdition: "users/search/by-edition",

    communicationTemplates: "communicationTemplates",

    projects: "projects",
    projectsByEdition: "projects/search/by-edition",

    invitations: "invitations",

    suggestions: "suggestions",

    userSkills: "user-skills",

    projectSkills: "project-skills",

    communications: "communications",
    communicationsByStudent: "communications/search/by-student",

    assignments: "assignments",
    assignmentsValidityByStudent: "assignments/search/validity-on-student",
    assignmentsValidityByProjectSkill: "assignments/search/validity-on-project-skill",

    students: "students",
    studentByQuery: "students/search/full-query",
    studentConflict: "students/search/conflict-query",
};

export default apiPaths;
