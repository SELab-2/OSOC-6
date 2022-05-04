import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

/**
 * Interface that describes the shape of communication template as received by the backend.
 */
export interface ICommunicationTemplate extends IBaseEntity {
    name: string;
    subject: string;
    template: string;

    _links: {
        communicationTemplate: IReferencer;
        self: IReferencer;
    };
}

/**
 * The collection name of communication templates.
 */
export const communicationTemplateCollectionName: string = "communicationTemplates";

/**
 * Type describing the shape of a communication template page.
 */
export type ICommunicationTemplatePage = IPage<{
    communicationTemplates: ICommunicationTemplate[];
}>;

/**
 * Type describing the shape of communication template links.
 */
export type ICommunicationTemplateLinks = IEntityLinks<{
    communicationTemplates: ICommunicationTemplate[];
}>;

/**
 * Constructor that allows us to easily post CommunicationTemplate entities to our backend.
 */
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
