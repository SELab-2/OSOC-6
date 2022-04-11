import { MouseEventHandler } from "react";
import axios from "axios";
import pathNames from "../properties/pathNames";
import { IUser } from "../api/UserEntity";
import { Edition, IEdition, IEditionsPage } from "../api/EditionEntity";
import { IInvitation, IInvitationsPage, Invitation } from "../api/InvitationEntity";
import { IProject, IProjectPage, Project } from "../api/ProjectEntity";
import { IProjectSkill, IProjectSkillPage, ProjectSkill } from "../api/ProjectSkillEntity";
import { IUserSkill, IUserSkillPage, UserSkill } from "../api/UserSkillEntity";
import {
    CommunicationTemplateEntity,
    ICommunicationTemplate,
    ICommunicationTemplatePage
} from "../api/CommunicationTemplateEntity";
import {
    EnglishProficiency,
    Gender,
    IStudent,
    IStudentPage,
    OsocExpericience,
    PronounsType,
    Student
} from "../api/StudentEntity";
import { ISkillType, ISkillTypePage, SkillType } from "../api/SkillTypeEntity";
import { AxiosConf } from "../api/requests";
import { Communication, ICommunication, ICommunicationPage } from "../api/CommunicationEntity";
import { Simulate } from "react-dom/test-utils";
import { ISuggestion, ISuggestionPage, Suggestion, SuggestionStrategy } from "../api/SuggestionEntity";

export const dataInjectionHandler: MouseEventHandler<
    HTMLButtonElement
> = async (_) => {
    const user: IUser = (await axios.get(pathNames.ownUser, AxiosConf))
        .data;
    console.log(user);

    const own_user_url: string = user._links.self.href;

    const userSkills: IUserSkillPage = (
        await axios.get(pathNames.userSkills, AxiosConf)
    ).data;
    let containedUserSkills: IUserSkill[];
    if (userSkills._embedded['user-skills'].length == 0) {
        const skill: UserSkill = new UserSkill(
            'The best',
            "you're simply the best!",
            own_user_url
        );

        containedUserSkills = await Promise.all(
            [skill].map(
                async (skill) =>
                    (
                        await axios.post(
                            pathNames.userSkills,
                            skill,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedUserSkills = userSkills._embedded['user-skills'];
    }
    console.log(containedUserSkills);

    const editions: IEditionsPage = (
        await axios.get(pathNames.editions, AxiosConf)
    ).data;
    console.log(editions);
    let containedEdition: IEdition;
    if (editions._embedded.editions.length == 0) {
        const edition1: Edition = new Edition('Edition 1', 2022, true);
        containedEdition = (
            await axios.post(pathNames.editions, edition1, AxiosConf)
        ).data;
    } else {
        containedEdition = editions._embedded.editions[0];
    }
    console.log(containedEdition);
    const editionUrl: string = containedEdition._links!.self.href;

    const invitations: IInvitationsPage = (
        await axios.get(pathNames.invitations, AxiosConf)
    ).data;
    let containedInvitation: IInvitation;
    if (invitations._embedded.invitations.length == 0) {
        const invitation1 = new Invitation(own_user_url, editionUrl);
        containedInvitation = (
            await axios.post(pathNames.invitations, invitation1, AxiosConf)
        ).data;
    } else {
        containedInvitation = invitations._embedded.invitations[0];
    }
    console.log(containedInvitation);

    const projects: IProjectPage = (
        await axios.get(pathNames.projects, AxiosConf)
    ).data;
    let containedProjects: IProject[];
    if (projects._embedded.projects.length == 0) {
        const project1: Project = new Project(
            'Bring the world back',
            'Project that will bing back the world to its former glorry',
            '',
            [],
            'A woman to work with',
            '',
            editionUrl,
            own_user_url
        );

        const project2: Project = new Project(
            'More boulder',
            'Project that will make bouldering even more accessible to geeks',
            '',
            [],
            'Boulder De Boulder',
            '',
            editionUrl,
            own_user_url
        );

        containedProjects = await Promise.all(
            [project1, project2].map(
                async (proj) =>
                    (
                        await axios.post(
                            pathNames.projects,
                            proj,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedProjects = projects._embedded.projects;
    }
    console.log(containedProjects);

    const projectSkills: IProjectSkillPage = (
        await axios.get(pathNames.projectSkills, AxiosConf)
    ).data;
    let containedProjectSkills: IProjectSkill[];
    if (projectSkills._embedded['project-skills'].length == 0) {
        const skill1: ProjectSkill = new ProjectSkill(
            'V10 boulderer',
            'We need strong climbers to test our boulders',
            containedProjects[1]._links!.self.href
        );

        containedProjectSkills = await Promise.all(
            [skill1].map(
                async (skill) =>
                    (
                        await axios.post(
                            pathNames.projectSkills,
                            skill,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedProjectSkills = projectSkills._embedded['project-skills'];
    }
    console.log(containedProjectSkills);

    const templates: ICommunicationTemplatePage = (
        await axios.get(pathNames.communicationTemplates, AxiosConf)
    ).data;
    let containedTemplates: ICommunicationTemplate[];
    if (templates._embedded.communicationTemplates.length == 0) {
        const template1 = new CommunicationTemplateEntity(
            'yes',
            'I say yes {reason}'
        );
        const template2 = new CommunicationTemplateEntity(
            'no',
            'I say no {reason}'
        );
        containedTemplates = await Promise.all(
            [template1, template2].map(
                async (template) =>
                    (
                        await axios.post(
                            pathNames.communicationTemplates,
                            template,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedTemplates = templates._embedded.communicationTemplates;
    }
    console.log(containedTemplates);

    const students: IStudentPage = (
        await axios.get(pathNames.students, AxiosConf)
    ).data;
    let containedStudents: IStudent[];
    if (students._embedded.students.length == 0) {
        const student1: Student = new Student(
            'kasper@mail.com',
            'He likes it like that',
            'Finding out the Spring ways',
            'Kasper Demeyere',
            'Master',
            '',
            5,
            'higher level',
            EnglishProficiency.fluent,
            'Kasper',
            Gender.male,
            'Ghent University',
            'Demeyere',
            'Dutch',
            '',
            OsocExpericience.yes_noStudentCoach,
            '+3257697568',
            '',
            [],
            PronounsType.he,
            [
                'Gaming on a nice chair',
                'programming whilst thinking about sleeping',
            ],
            ['I love to Spring Spring in java Spring!'],
            '',
            '3th',
            editionUrl
        );

        containedStudents = await Promise.all(
            [student1].map(
                async (student) =>
                    (
                        await axios.post(
                            pathNames.students,
                            student,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedStudents = students._embedded.students;
    }
    const some_student_uri = containedStudents[0]._links.self.href;
    console.log(containedStudents);

    const skillTypes: ISkillTypePage = (
        await axios.get(pathNames.skillTypes, AxiosConf)
    ).data;
    let containedSkillTypes: ISkillType[];
    if (skillTypes._embedded.skillTypes.length == 0) {
        const skillType1 = new SkillType('V10 boulderer', '000000');

        containedSkillTypes = await Promise.all(
            [skillType1].map(
                async (skill) =>
                    (
                        await axios.post(
                            pathNames.skillTypes,
                            skillType1,
                            AxiosConf
                        )
                    ).data
            )
        );
    } else {
        containedSkillTypes = skillTypes._embedded.skillTypes;
    }
    console.log(containedSkillTypes);

    const communications: ICommunicationPage = (await axios.get(pathNames.communications, AxiosConf)).data;
    let containedCommunications: ICommunication[];
    if (communications._embedded.communications.length == 0) {
        const communication1: Communication = new Communication(
            "sms", containedTemplates[0]._links.self.href,
            "An apple for the thirst and a yes for you", own_user_url,
            some_student_uri);

        containedCommunications = await Promise.all(
            [communication1].map(async com => (await axios.post(pathNames.communications, com, AxiosConf)).data)
        )
    } else {
        containedCommunications = communications._embedded.communications;
    }
    console.log(containedCommunications);

    const suggestions: ISuggestionPage = (await axios.get(pathNames.suggestions, AxiosConf)).data;
    let containedSuggestions: ISuggestion[];
    if (suggestions._embedded.suggestions.length == 0) {
        const suggestion1: Suggestion = new Suggestion(
            SuggestionStrategy.yes, "Seems like a competent kid", own_user_url, some_student_uri);

        containedSuggestions = await Promise.all(
            [suggestion1].map(async sugg => (await axios.post(pathNames.suggestions, sugg, AxiosConf)).data)
        )
    } else {
        containedSuggestions = suggestions._embedded.suggestions;
    }
    console.log(containedSuggestions);
};
