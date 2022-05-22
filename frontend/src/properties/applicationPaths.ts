/**
 * Paths used the web-application.
 */
const applicationPaths = {
    base: "http://localhost/",
    index: "",
    home: "home",
    inject: "inject",

    projects: "projects",
    projectCreation: "projects/create",
    projectInfo: "projects/[id]",

    users: "users",
    profile: "profile",
    changeEmail: "changeEmail",

    assignStudents: "assignStudents",

    students: "students",
    studentCreation: "students/create",
    studentInfo: "students/[id]",
    studentEdit: "students/[id]/edit",

    login: "login",
    loginError: "loginError",
    changePassword: "changePassword",
    registration: "registration",

    forgotPassword: "forgotPassword",
    resetPassword: "resetPassword",

    communicationTemplateBase: "communicationTemplates",
    communicationTemplateCreation: "communicationTemplates/create",
    communicationTemplateInfo: "communicationTemplates/[id]",
    communicationTemplateEdit: "communicationTemplates/[id]/edit",

    communicationBase: "communications",
    communicationInfo: "communications/[id]",
    communicationRegistration: "register-communication",

    editionBase: "editions",
    editionCreate: "editions/create",

    skillTypesBase: "skillTypes",
    skillTypesCreate: "skillTypes/create",

    error: "_error",
};

export default applicationPaths;
