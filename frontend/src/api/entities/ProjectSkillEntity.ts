import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface IProjectSkill extends IBaseEntity {
    name: string;
    additionalInfo: string;

    _links: {
        project: IReferencer;
        assignments: IReferencer;
        projectSkill: IReferencer;
        self: IReferencer;
    };
}

/**
 * An [IProjectSkill] that is completely empty. Using this we don't need as much ?. in our code.
 */
export const emptyProjectSkill: IProjectSkill = {
    name: "",
    additionalInfo: "",

    _links: {
        project: { href: "" },
        assignments: { href: "" },
        projectSkill: { href: "" },
        self: { href: "" },
    },
};

export const projectSkillCollectionName: string = "project-skills";
export type IProjectSkillPage = IPage<{ "project-skills": IProjectSkill[] }>;
export type IProjectSkillLinks = IEntityLinks<{ "project-skills": IProjectSkill[] }>;

export class ProjectSkill {
    constructor(name: string, additionalInfo: string, project: string) {
        this.name = name;
        this.additionalInfo = additionalInfo;
        this.project = project;
    }

    additionalInfo: string;
    name: string;
    project: string;
}
