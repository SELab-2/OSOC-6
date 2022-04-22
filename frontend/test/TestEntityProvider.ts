import { IProject } from "../src/api/entities/ProjectEntity";
import { IBaseEntity, IEntityLinks, IPage } from "../src/api/entities/BaseEntities";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { IProjectSkill } from "../src/api/entities/ProjectSkillEntity";
import { IUser, UserRole } from "../src/api/entities/UserEntity";
import { baseSkillType, ISkillType } from "../src/api/entities/SkillTypeEntity";
import { IAssignment } from "../src/api/entities/AssignmentEntity";
import {
    EnglishProficiency,
    Gender,
    IStudent,
    OsocExpericience,
    Status,
} from "../src/api/entities/StudentEntity";

export function getBaseOkResponse(data: any): AxiosResponse {
    return {
        data,
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
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
            neededSkills: { href: baseProjectPath + "/neededSkills" },
            coaches: { href: baseProjectPath + "coaches" },
            edition: { href: baseProjectPath + "/edition" },
            creator: { href: baseProjectPath + "/creator" },
            project: { href: baseProjectPath },
            self: { href: baseProjectPath },
        },
        name: "project name",
        info: "project info",
        goals: [],
        versionManagement: "",
        partnerName: "",
        partnerWebsite: "",
    };
}

export function getBaseAdmin(id: string): IUser {
    const baseUserPath = "http://localhost/api/users/" + id;
    return {
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: { authority: UserRole.admin },
        callName: "Jos Jossem",
        credentialsNonExpired: true,
        email: "jos@mail.com",
        enabled: true,
        userRole: UserRole.admin,
        username: "josjossem",

        _links: {
            communications: { href: baseUserPath + "/communications" },
            projects: { href: baseUserPath + "/projects" },
            receivedInvitations: { href: baseUserPath + "/receivedInvitations" },
            skills: { href: baseUserPath + "/skills" },
            userEntity: { href: baseUserPath },
            self: { href: baseUserPath },
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
    const baseSkillTypePath = "http://localhost/api/skill-type/" + id;
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
        isSuggestion: true,
        isValid: true,
        reason: "This assignment was mendetory, we don't have any other",
        timestamp: "Now",

        _links: {
            assigner: { href: baseAssignmentsPath },
            projectSkill: { href: baseAssignmentsPath },
            student: { href: baseAssignmentsPath },
            assignment: { href: baseAssignmentsPath },
            self: { href: baseAssignmentsPath },
        },
    };
}

export function getBaseStudent(id: string): IStudent {
    const baseAssignmentsPath = "http://localhost/api/assignments/" + id;
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
        curriculumVitaeURI: "",
        portfolioURI: "",
        motivationURI: "",
        writtenMotivation: "",
        currentDiploma: "Master",
        durationCurrentDegree: 5,
        yearInCourse: "3th",
        institutionName: "Ghent University",
        bestSkill: "Finding out the Spring ways",
        funFact: "A fun fact about me",
        osocExperience: OsocExpericience.yes_noStudentCoach,
        status: Status.maybe,
        additionalStudentInfo: "He likes it like that",
        studies: ["I love to Spring Spring in java Spring!"],
        skills: ["Gaming on a nice chair", "programming whilst thinking about sleeping"],
        yesSuggestionCount: 0,
        maybeSuggestionCount: 0,
        noSuggestionCount: 0,
        _links: {
            assignments: { href: baseAssignmentsPath },
            suggestions: { href: baseAssignmentsPath },
            edition: { href: baseAssignmentsPath },
            student: { href: baseAssignmentsPath },
            self: { href: baseAssignmentsPath },
        },
    };
}
