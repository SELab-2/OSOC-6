import { IBaseEntity, IPage, IReferencer } from "./BaseEntities";

export interface ICommunicationTemplate extends IBaseEntity {
    name: string;
    template: string;

    _links: {
        communicationTemplate: IReferencer;
        self: IReferencer;
    }
}

export type ICommunicationTemplatePage = IPage<{ communicationTemplates: ICommunicationTemplate[] }>

export class CommunicationTemplate {
    constructor(name: string, template: string) {
        this.name = name;
        this.template = template;
    }

    name: string;
    template: string;
}
