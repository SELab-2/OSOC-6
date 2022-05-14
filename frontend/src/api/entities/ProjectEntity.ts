import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import { ISkillType } from "./SkillTypeEntity";

export interface IProject extends IBaseEntity {
    goals: string[];
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;

    _links: {
        coaches: IReferencer;
        creator: IReferencer;
        edition: IReferencer;
        neededSkills: IReferencer;
        project: IReferencer;
        self: IReferencer;
    };
}

/**
 * An [IProject] that is completely empty. Using this we don't need as much ?. in our code.
 */
export const emptyProject: IProject = {
    goals: [],
    name: "",
    info: "",
    versionManagement: "",
    partnerName: "",
    partnerWebsite: "",

    _links: {
        coaches: { href: "" },
        creator: { href: "" },
        edition: { href: "" },
        neededSkills: { href: "" },
        project: { href: "" },
        self: { href: "" },
    },
};

export const projectCollectionName: string = "projects";
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

    creator: string;
    edition: string;
    goals: string[];
    name: string;
    info: string;
    partnerName: string;
    partnerWebsite: string;
    versionManagement: string;
}
