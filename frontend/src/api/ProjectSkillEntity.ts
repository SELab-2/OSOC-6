import { BaseEntity, Page, Referencer } from './BaseEntities';

export interface IProjectSkill extends BaseEntity {
    name: string;
    additionalInfo: string;

    _links: {
        project: Referencer;
        projectSkill: Referencer;
        self: Referencer;
    };
}

export type ProjectSkillPage = Page<{ 'project-skills': IProjectSkill[] }>;

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
