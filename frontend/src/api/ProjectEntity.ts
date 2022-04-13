import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import { getAllEntities } from "./requests";

export interface IProject extends IBaseEntity {
    goals: string[];
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
    creator: string;

    _links: {
        assignment: IReferencer;
        coaches: IReferencer;
        creator: IReferencer;
        edition: IReferencer;
        neededSkills: IReferencer;
        project: IReferencer;
        self: IReferencer;
    };
}

export type IProjectPage = IPage<{ projects: IProject[] }>;
export type IProjectLinks = IEntityLinks<{ projects: IProject[] }>;

export class Project {
    constructor(
        name: string,
        info: string,
        versionManagement: string,
        goals: string[],
        partnerName: string,
        partnerWebsite: string,
        edition: string,
        creator: string
    ) {
        this.name = name;
        this.info = info;
        this.versionManagement = versionManagement;
        this.goals = goals;
        this.partnerName = partnerName;
        this.partnerWebsite = partnerWebsite;
        this.edition = edition;
        this.creator = creator;
    }

    assignments: string | undefined;
    creator: string;
    edition: string;
    goals: string[];
    name: string;
    info: string;
    partnerName: string;
    partnerWebsite: string;
    versionManagement: string;
}

/**
 * Fetches all projects from the backend
 */
export function getAllProjects(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntities(url, "projects");
}
