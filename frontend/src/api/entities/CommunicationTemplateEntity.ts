import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface ICommunicationTemplate extends IBaseEntity {
    name: string;
    subject: string;
    template: string;

    _links: {
        communicationTemplate: IReferencer;
        self: IReferencer;
    };
}

export const communicationTemplateCollectionName: string = "communicationTemplates";
export type ICommunicationTemplatePage = IPage<{
    communicationTemplates: ICommunicationTemplate[];
}>;
export type ICommunicationTemplateLinks = IEntityLinks<{
    communicationTemplates: ICommunicationTemplate[];
}>;

export class CommunicationTemplateEntity {
    constructor(name: string, subject: string, template: string) {
        this.name = name;
        this.subject = subject;
        this.template = template;
    }

    name: string;
    subject: string;
    template: string;
}
