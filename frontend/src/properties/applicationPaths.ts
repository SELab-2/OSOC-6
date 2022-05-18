/**
 * Paths used the web-application.
 */
const applicationPaths = {
    base: "localhost",
    index: "",
    home: "home",

    projects: "projects",
    projectCreation: "projects/create",
    projectInfo: "projects/[id]",

    users: "users",
    profile: "profile",
    changeEmail: "changeEmail",

    assignStudents: "assignStudents",

    students: "students",

    login: "login",
    loginError: "loginError",
    changePassword: "changePassword",
    registration: "registration",

    communicationTemplateBase: "communicationTemplates",
    communicationTemplateCreation: "communicationTemplates/create",
    communicationTemplateInfo: "communicationTemplates/[id]",
    communicationTemplateEdit: "communicationTemplates/[id]/edit",

    communicationBase: "communications",
    communicationInfo: "communications/[id]",

    editionBase: "editions",
    editionCreate: "editions/create",

    skillTypesBase: "skillTypes",
};

export default applicationPaths;
