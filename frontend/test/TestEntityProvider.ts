import { IProject } from "../src/api/entities/ProjectEntity";
import { IBaseEntity, IPage } from "../src/api/entities/BaseEntities";
import { AxiosResponse } from "axios";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function getBaseOkResponse(data: any): AxiosResponse {
    return {
        data,
        status: StatusCodes.OK,
        statusText: ReasonPhrases.OK,
        headers: {},
        config: {},
    }
}

export function getBasePage<T extends IBaseEntity>(apiPath: string, collectionName: string, content: T[]): IPage<{[k: string]: T[]}> {
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
    }
}

export function getBaseProject(id: string): IProject {
    const baseProjectPath = "http://localhost/api/projects/" + id;
    return {
        _links: {
            self: { href: baseProjectPath },
            neededSkills: { href: baseProjectPath + "/neededSkills" },
            project: { href: baseProjectPath + "/project" },
            coaches: { href: baseProjectPath + "coaches" },
            edition: { href: baseProjectPath + "/edition" },
            creator: { href: baseProjectPath + "/creator" },
        },
        name: "project name",
        info: "project info",
        goals: [],
        versionManagement: "",
        partnerName: "",
        partnerWebsite: "",
    }
}