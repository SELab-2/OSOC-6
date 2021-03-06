import { IProject } from "../../src/api/entities/ProjectEntity";
import { IBaseEntity, IEntityLinks, IPage } from "../../src/api/entities/BaseEntities";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { IProjectSkill } from "../../src/api/entities/ProjectSkillEntity";
import { IUser, UserRole } from "../../src/api/entities/UserEntity";
import { baseSkillType, ISkillType } from "../../src/api/entities/SkillTypeEntity";
import { IAssignment } from "../../src/api/entities/AssignmentEntity";
import {
    EnglishProficiency,
    Gender,
    IStudent,
    OsocExperience,
    Status,
} from "../../src/api/entities/StudentEntity";
import { IEdition } from "../../src/api/entities/EditionEntity";
import { ICommunicationTemplate } from "../../src/api/entities/CommunicationTemplateEntity";
import { ICommunication } from "../../src/api/entities/CommunicationEntity";
import { ISuggestion, SuggestionStrategy } from "../../src/api/entities/SuggestionEntity";
import { IInvitation } from "../../src/api/entities/InvitationEntity";

export function getBaseOkResponse(data: any): AxiosResponse {
    return {
        data,
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
    };
}

export function getBaseNoContentResponse(): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.NO_CONTENT,
        statusText: ReasonPhrases.NO_CONTENT,
        headers: {},
        config: {},
    };
}

export function getBaseBadRequestResponse(): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.BAD_REQUEST,
        statusText: ReasonPhrases.BAD_REQUEST,
        headers: {},
        config: {},
        request: {},
    };
}

export function getBaseForbiddenResponse(): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.FORBIDDEN,
        statusText: ReasonPhrases.FORBIDDEN,
        headers: {},
        config: {},
        request: {},
    };
}

export function getBaseTeapot(): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.IM_A_TEAPOT,
        statusText: ReasonPhrases.IM_A_TEAPOT,
        headers: {},
        config: {},
        request: {},
    };
}

export function getBaseMovedResponse(url: string): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.MOVED_TEMPORARILY,
        statusText: ReasonPhrases.MOVED_TEMPORARILY,
        headers: {},
        config: {},
        request: { responseURL: url },
    };
}

export function getBaseRedirectResponse(url: string): AxiosResponse {
    return {
        data: {},
        status: StatusCodes.TEMPORARY_REDIRECT,
        statusText: ReasonPhrases.TEMPORARY_REDIRECT,
        headers: {},
        config: {},
        request: { responseURL: url },
    };
}

export function getBasePage<T extends IBaseEntity>(
    apiPath: string,
    collectionName: string,
    content: T[]
): IPage<{ [k: string]: T[] }> {
    return {
        _links: {
            self: { href: "http://localhost/api/" + apiPath },
            profile: { href: "http://localhost/api/profile/" + apiPath },
            search: undefined,
        },
        _embedded: { [collectionName]: content },
        page: {
            number: 1,
            size: content.length,
            totalElements: content.length,
            totalPages: 1,
        },
    };
}

export function getBaseLinks<T extends IBaseEntity>(
    apiPath: string,
    collectionName: string,
    content: T[]
): IEntityLinks<{ [k: string]: T[] }> {
    return {
        _links: {
            self: { href: "http://localhost/api/" + apiPath },
        },
        _embedded: { [collectionName]: content },
    };
}

export function getBaseProject(id: string): IProject {
    const baseProjectPath = "http://localhost/api/projects/" + id;
    return {
        _links: {
            self: { href: baseProjectPath },
            neededSkills: { href: baseProjectPath + "/neededSkills" },
            coaches: { href: baseProjectPath + "/coaches" },
            edition: { href: baseProjectPath + "/edition" },
            creator: { href: baseProjectPath + "/creator" },
            project: { href: baseProjectPath },
        },
        name: "Some project name",
        info: "some project info",
        goals: ["apples should grow on trees", "children play outside"],
        versionManagement: "https://github.com/SELab-2/OSOC-6",
        partnerName: "a partner that is not git",
        partnerWebsite: "www.example.com/i-wish-i-was-i-was-git",
    };
}

export function getBaseUser(id: string, role: UserRole, enabled: boolean): IUser {
    return {
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: {
            authority: role,
        },
        callName: "Jef",
        credentialsNonExpired: true,
        email: "test@mail.com",
        enabled: enabled,
        userRole: role,
        username: "test@mail.com",
        _links: {
            self: { href: "http://localhost/api/users/" + id },
            communications: { href: "http://localhost/api/users/" + id + "/communications" },
            projects: { href: "http://localhost/api/users/" + id + "/projects" },
            receivedInvitations: { href: "http://localhost/api/users/" + id + "/receivedInvitations" },
            skills: { href: "http://localhost/api/users/" + id + "/skills" },
            userEntity: { href: "http://localhost/api/users/" + id },
        },
    };
}

export function getBaseProjectSkill(id: string): IProjectSkill {
    const baseProjectSkillPath = "http://localhost/api/project-skill/" + id;
    return {
        name: "Some project skill name",
        additionalInfo: "We need this skill so we can make te project without any regrets",

        _links: {
            project: { href: baseProjectSkillPath + "/project" },
            assignments: { href: baseProjectSkillPath + "/assignments" },
            projectSkill: { href: baseProjectSkillPath },
            self: { href: baseProjectSkillPath },
        },
    };
}

export function getBaseSkillType(id: string): ISkillType {
    const baseSkillTypePath = "http://localhost/api/skillTypes/" + id;
    return {
        name: baseSkillType,
        colour: "#5377e1",

        _links: {
            skillType: { href: baseSkillTypePath },
            self: { href: baseSkillTypePath },
        },
    };
}

export function getBaseAssignment(id: string): IAssignment {
    const baseAssignmentsPath = "http://localhost/api/assignments/" + id;
    return {
        isValid: true,
        reason: "This assignment was mandatory, we don't have any other",
        timestamp: "2022-05-05T17:57:49.963+00:00",

        _links: {
            assigner: { href: baseAssignmentsPath + "/assigner" },
            projectSkill: { href: baseAssignmentsPath + "/projectSkill" },
            student: { href: baseAssignmentsPath + "/student" },
            assignment: { href: baseAssignmentsPath },
            self: { href: baseAssignmentsPath },
        },
    };
}

export function getBaseActiveEdition(id: string, name: string): IEdition {
    const baseEditionPath = "http://localhost/api/editions/" + id;
    return {
        name,
        year: 2022,
        active: true,

        _links: {
            edition: { href: baseEditionPath },
            self: { href: baseEditionPath },
        },
    };
}

/**
 * Get a base suggestion
 * @param id
 */
export function getBaseSuggestion(id: string): ISuggestion {
    const baseSuggestionPath = "http://localhost/api/suggestions/" + id;

    return {
        reason: "Some reason",
        strategy: SuggestionStrategy.yes,
        timestamp: "2022-05-05T17:57:49.963+00:00",
        _links: {
            coach: { href: baseSuggestionPath + "/coach" },
            student: { href: baseSuggestionPath + "/student" },
            suggestion: { href: baseSuggestionPath },
            self: { href: baseSuggestionPath },
        },
    };
}

export function getBaseCommunicationTemplate(id: string): ICommunicationTemplate {
    const baseCommunicationPath = "http://localhost/api/communicationTemplates/" + id;
    return {
        name: "Selected",
        subject: "Selection notification",
        template: "You have been selected to join the OSOC experience.",

        _links: {
            communicationTemplate: { href: baseCommunicationPath },
            self: { href: baseCommunicationPath },
        },
    };
}

export function getBaseCommunication(id: string): ICommunication {
    const baseCommunicationPath = "http://localhost/api/communications/" + id;
    return {
        timestamp: "2022-05-05T17:57:49.963+00:00",
        subject: "You were selected",
        medium: "email",
        content: "Good job Kasper, you have been selected.",

        _links: {
            self: { href: baseCommunicationPath },
            communication: { href: baseCommunicationPath },
            student: { href: baseCommunicationPath + "/student" },
            sender: { href: baseCommunicationPath + "/sender" },
            template: { href: baseCommunicationPath + "/template" },
        },
    };
}

/**
 * Get a basic student
 * @param id
 */
export function getBaseStudent(id: string): IStudent {
    const baseStudentPath = "http://localhost/api/students/" + id;
    return {
        email: "kasper@mail.com",
        firstName: "Kasper",
        lastName: "Demeyere",
        gender: Gender.male,
        callName: "Kasper Demeyere",
        pronouns: "he/him",
        mostFluentLanguage: "Dutch",
        englishProficiency: EnglishProficiency.expressive,
        phoneNumber: "+3257697568",
        workType: "Yes, I can work with a student employment agreement in Belgium",
        daytimeResponsibilities: "Eating and drinking",
        curriculumVitaeURI: "https://my.cv.com",
        portfolioURI: "https://my.portfolio.com",
        motivationURI: "https://my.motivation.com",
        writtenMotivation: "This is my written motivation",
        currentDiploma: "Master",
        durationCurrentDegree: 5,
        yearInCourse: "3th",
        institutionName: "Ghent University",
        bestSkill: "Finding out the Spring ways",
        funFact: "A fun fact about me",
        osocExperience: OsocExperience.yes_noStudentCoach,
        status: Status.maybe,
        additionalStudentInfo: "He likes it like that",
        studies: ["I love to Spring Spring in java Spring!"],
        skills: ["Gaming on a nice chair"],
        yesSuggestionCount: 0,
        maybeSuggestionCount: 0,
        noSuggestionCount: 0,
        _links: {
            assignments: { href: baseStudentPath + "/assignments" },
            suggestions: { href: baseStudentPath + "/suggestions" },
            edition: { href: baseStudentPath + "/edition" },
            student: { href: baseStudentPath },
            self: { href: baseStudentPath },
        },
    };
}

export function getBaseInvitation(token: string, id: string): IInvitation {
    const baseInvitation = "http://localhost/api/invitations/" + id;
    return {
        token: token,
        creationTimestamp: "2022-05-05T17:57:49.963+00:00",
        used: false,
        _links: {
            edition: { href: baseInvitation + "/edition" },
            issuer: { href: baseInvitation + "/issuer" },
            subject: { href: baseInvitation + "/subject" },
            self: { href: baseInvitation },
            invitation: { href: baseInvitation },
        },
    };
}
