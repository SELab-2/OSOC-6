import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface IProjectSkill extends IBaseEntity {
    name: string;
    additionalInfo: string;

    _links: {
        project: IReferencer;
        projectSkill: IReferencer;
        self: IReferencer;
    };
}

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
