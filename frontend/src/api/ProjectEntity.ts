import { BaseEntity, Page, Referencer } from './BaseEntities';

export interface IProject extends BaseEntity {
    goals: string[];
    name: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
    creator: string;

    _links: {
        assignment: Referencer;
        coaches: Referencer;
        creator: Referencer;
        edition: Referencer;
        neededSkills: Referencer;
        project: Referencer;
        self: Referencer;
    };
}

export type ProjectPage = Page<{ projects: IProject[] }>;

export class Project {
    constructor(
        name: string,
        versionManagement: string,
        goals: string[],
        partnerName: string,
        partnerWebsite: string,
        edition: string,
        creator: string
    ) {
        this.name = name;
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
    partnerName: string;
    partnerWebsite: string;
    versionManagement: string;
}
