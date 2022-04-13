import { IBaseEntity, IPage, IReferencer } from "./BaseEntities";
import axios from "axios";

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
export async function getAllProjects(): Promise<IProject[]> {
    let fetchedAll: boolean = false;
    let currentPage: number = 0;
    let projects: IProject[] = [];

    while (!fetchedAll) {
        await axios
            .get("http://localhost/api/projects?size=1000&page=" + currentPage)
            .then((response) => {
                projects = projects.concat(response.data._embedded.projects);
                fetchedAll = currentPage + 1 === response.data.page.totalPages;
                currentPage++;
            });
    }

    return projects;
}
