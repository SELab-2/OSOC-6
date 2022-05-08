/**
 * The paths used by our api.
 */
const apiPaths = {
    base: "http://localhost/api/",

    loginRedirect: "login",
    login: "login-processing",
    registration: "registration",
    logout: "logout",

    editions: "editions",
    editionByName: "editions/search/by-name",

    skillTypes: "skillTypes",
    skillTypesByName: "skillTypes/search/by-name",

    users: "users",
    ownUser: "users/search/own-user",

    communicationTemplates: "communicationTemplates",

    projects: "projects",

    invitations: "invitations",

    suggestions: "suggestions",

    userSkills: "user-skills",

    projectSkills: "project-skills",

    communications: "communications",

    assignments: "assignments",

    students: "students",
    studentByQuery: "students/search/full-query",
};

export default apiPaths;
