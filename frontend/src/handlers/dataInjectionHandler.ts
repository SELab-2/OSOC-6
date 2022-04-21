import { MouseEventHandler } from "react";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { IUser, IUsersPage, User } from "../api/entities/UserEntity";
import { Edition, IEdition, IEditionsPage } from "../api/entities/EditionEntity";
import { IInvitation, IInvitationsPage, Invitation } from "../api/entities/InvitationEntity";
import { IProject, IProjectPage, Project } from "../api/entities/ProjectEntity";
import { IProjectSkill, IProjectSkillPage, ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { IUserSkill, IUserSkillPage, UserSkill } from "../api/entities/UserSkillEntity";
import {
    CommunicationTemplateEntity,
    ICommunicationTemplate,
    ICommunicationTemplatePage,
} from "../api/entities/CommunicationTemplateEntity";
import {
    EnglishProficiency,
    Gender,
    IStudent,
    IStudentPage,
    OsocExpericience,
    PronounsType,
    Student,
} from "../api/entities/StudentEntity";
import { baseSkillType, ISkillType, ISkillTypePage, SkillType } from "../api/entities/SkillTypeEntity";
import { Communication, ICommunication, ICommunicationPage } from "../api/entities/CommunicationEntity";
import {
    ISuggestion,
    ISuggestionPage,
    Suggestion,
    SuggestionStrategy,
} from "../api/entities/SuggestionEntity";
import { Assignment, IAssignment, IAssignmentPage } from "../api/entities/AssignmentEntity";
import { getSkillTypeFromSkill } from "../api/calls/skillTypeCalls";
import { AxiosConf } from "../api/calls/baseCalls";

export const dataInjectionHandler: MouseEventHandler<HTMLButtonElement> = async (_) => {
    const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
    console.log(user);

    const own_user_url: string = user._links.self.href;

    const userSkills: IUserSkillPage = (await axios.get(apiPaths.userSkills, AxiosConf)).data;
    console.log(userSkills);
    let containedUserSkills: IUserSkill[];
    if (userSkills._embedded["user-skills"].length == 0) {
        const skill: UserSkill = new UserSkill("The best", "you're simply the best!", own_user_url);

        containedUserSkills = await Promise.all(
            [skill].map(async (skill) => (await axios.post(apiPaths.userSkills, skill, AxiosConf)).data)
        );
    } else {
        containedUserSkills = userSkills._embedded["user-skills"];
    }
    console.log(containedUserSkills);
    const simpleUserSkill: IUserSkill = containedUserSkills[0];

    const editions: IEditionsPage = (await axios.get(apiPaths.editions, AxiosConf)).data;
    console.log(editions);
    let containedEdition: IEdition;
    if (editions._embedded.editions.length == 0) {
        const edition1: Edition = new Edition("Edition 1", 2022, true);
        containedEdition = (await axios.post(apiPaths.editions, edition1, AxiosConf)).data;
    } else {
        containedEdition = editions._embedded.editions[0];
    }
    console.log(containedEdition);
    const editionUrl: string = containedEdition._links!.self.href;

    const invitations: IInvitationsPage = (await axios.get(apiPaths.invitations, AxiosConf)).data;
    let containedInvitation: IInvitation;
    if (invitations._embedded.invitations.length == 0) {
        const invitation1 = new Invitation(own_user_url, editionUrl);
        containedInvitation = (await axios.post(apiPaths.invitations, invitation1, AxiosConf)).data;
    } else {
        containedInvitation = invitations._embedded.invitations[0];
    }
    console.log(containedInvitation);

    const projects: IProjectPage = (await axios.get(apiPaths.projects, AxiosConf)).data;
    let containedProjects: IProject[];
    if (projects._embedded.projects.length == 0) {
        const project1: Project = new Project(
            "Bring the world back",
            "Project that will bing back the world to its former glorry",
            "",
            [],
            "A woman to work with",
            "",
            editionUrl,
            own_user_url
        );

        const project2: Project = new Project(
            "More boulder",
            "Project that will make bouldering even more accessible to geeks",
            "",
            [],
            "Boulder De Boulder",
            "",
            editionUrl,
            own_user_url
        );

        containedProjects = await Promise.all(
            [project1, project2].map(
                async (proj) => (await axios.post(apiPaths.projects, proj, AxiosConf)).data
            )
        );
    } else {
        containedProjects = projects._embedded.projects;
    }
    console.log(containedProjects);

    const projectSkills: IProjectSkillPage = (await axios.get(apiPaths.projectSkills, AxiosConf)).data;
    let containedProjectSkills: IProjectSkill[];
    if (projectSkills._embedded["project-skills"].length == 0) {
        const skill1: ProjectSkill = new ProjectSkill(
            "V10 boulderer",
            "We need strong climbers to test our boulders",
            containedProjects[1]._links!.self.href
        );

        containedProjectSkills = await Promise.all(
            [skill1].map(async (skill) => (await axios.post(apiPaths.projectSkills, skill, AxiosConf)).data)
        );
    } else {
        containedProjectSkills = projectSkills._embedded["project-skills"];
    }
    console.log(containedProjectSkills);
    const projectBoulderSkill: IProjectSkill = containedProjectSkills[0];

    const templates: ICommunicationTemplatePage = (
        await axios.get(apiPaths.communicationTemplates, AxiosConf)
    ).data;
    let containedTemplates: ICommunicationTemplate[];
    if (templates._embedded.communicationTemplates.length == 0) {
        const template1 = new CommunicationTemplateEntity("yes", "I say yes {reason}");
        const template2 = new CommunicationTemplateEntity("no", "I say no {reason}");
        containedTemplates = await Promise.all(
            [template1, template2].map(
                async (template) =>
                    (
                        await axios.post(apiPaths.communicationTemplates, template, AxiosConf)
                    ).data
            )
        );
    } else {
        containedTemplates = templates._embedded.communicationTemplates;
    }
    console.log(containedTemplates);

    const students: IStudentPage = (await axios.get(apiPaths.students, AxiosConf)).data;
    let containedStudents: IStudent[];
    if (students._embedded.students.length == 0) {
        const student1: Student = new Student(
            "kasper@mail.com",
            "He likes it like that",
            "Finding out the Spring ways",
            "Kasper Demeyere",
            "Master",
            "",
            5,
            "higher level",
            EnglishProficiency.fluent,
            "Kasper",
            Gender.male,
            "Ghent University",
            "Demeyere",
            "Dutch",
            "",
            OsocExpericience.yes_noStudentCoach,
            "+3257697568",
            "",
            "",
            "",
            "",
            PronounsType.he,
            ["Gaming on a nice chair", "programming whilst thinking about sleeping"],
            ["I love to Spring Spring in java Spring!"],
            "",
            "3th",
            editionUrl
        );

        containedStudents = await Promise.all(
            [student1].map(async (student) => (await axios.post(apiPaths.students, student, AxiosConf)).data)
        );
    } else {
        containedStudents = students._embedded.students;
    }
    const someStudentUri = containedStudents[0]._links.self.href;
    console.log(containedStudents);

    const skillTypes: ISkillTypePage = (await axios.get(apiPaths.skillTypes, AxiosConf)).data;
    let containedSkillTypes: ISkillType[];
    if (skillTypes._embedded.skillTypes.length == 0) {
        const skillType1 = new SkillType("V10 boulderer", "#427162");
        const skillTypeOther = new SkillType(baseSkillType, "#929199");

        containedSkillTypes = await Promise.all(
            [skillType1, skillTypeOther].map(
                async (skill) => (await axios.post(apiPaths.skillTypes, skill, AxiosConf)).data
            )
        );
    } else {
        containedSkillTypes = skillTypes._embedded.skillTypes;
    }
    console.log(containedSkillTypes);

    console.log("Test getSkillTypeFromSkill:");
    console.log(await getSkillTypeFromSkill(projectBoulderSkill));
    console.log(await getSkillTypeFromSkill(simpleUserSkill));

    const communications: ICommunicationPage = (await axios.get(apiPaths.communications, AxiosConf)).data;
    let containedCommunications: ICommunication[];
    if (communications._embedded.communications.length == 0) {
        const communication1: Communication = new Communication(
            "sms",
            containedTemplates[0]._links.self.href,
            "An apple for the thirst and a yes for you",
            own_user_url,
            someStudentUri
        );

        containedCommunications = await Promise.all(
            [communication1].map(
                async (com) => (await axios.post(apiPaths.communications, com, AxiosConf)).data
            )
        );
    } else {
        containedCommunications = communications._embedded.communications;
    }
    console.log(containedCommunications);

    const suggestions: ISuggestionPage = (await axios.get(apiPaths.suggestions, AxiosConf)).data;
    let containedSuggestions: ISuggestion[];
    if (suggestions._embedded.suggestions.length == 0) {
        const suggestion1: Suggestion = new Suggestion(
            SuggestionStrategy.yes,
            "Seems like a competent kid",
            own_user_url,
            someStudentUri
        );

        containedSuggestions = await Promise.all(
            [suggestion1].map(async (sugg) => (await axios.post(apiPaths.suggestions, sugg, AxiosConf)).data)
        );
    } else {
        containedSuggestions = suggestions._embedded.suggestions;
    }
    console.log(containedSuggestions);

    const assignments: IAssignmentPage = (await axios.get(apiPaths.assignments, AxiosConf)).data;
    let containedAssignments: IAssignment[];
    if (assignments._embedded.assignments.length == 0) {
        const assignment1: Assignment = new Assignment(
            true,
            true,
            "You! here! now!",
            own_user_url,
            someStudentUri,
            projectBoulderSkill._links.self.href
        );

        containedAssignments = await Promise.all(
            [assignment1].map(
                async (assign) => (await axios.post(apiPaths.assignments, assign, AxiosConf)).data
            )
        );
    } else {
        containedAssignments = assignments._embedded.assignments;
    }
    console.log(containedAssignments);

    // Create user with query token
    const users: IUsersPage = (await axios.get(apiPaths.users, AxiosConf)).data;
    if (users._embedded.users.length < 2) {
        //console.log(crypto.randomUUID());
        const coachUser1: User = new User("Ben", "ben@mail.com", crypto.randomUUID());

        await Promise.all(
            [coachUser1].map(
                async (user) =>
                    (
                        await axios.post(apiPaths.registration, user, {
                            params: {
                                token: containedInvitation.token,
                            },
                            ...AxiosConf,
                        })
                    ).data
            )
        );
        console.log(
            "You registered a new user. You are now logged out. " +
                "This happens due to a bug in the backend. It will be fixed eventually."
        );
    } else {
        let containedUsers = (<IUsersPage>(await axios.get(apiPaths.users, AxiosConf)).data)._embedded.users;
        console.log(containedUsers);
    }
};
