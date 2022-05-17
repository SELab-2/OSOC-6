import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

/**
 * Interface that describes the shape of communication as received by the backend.
 */
export interface ICommunication extends IBaseEntity {
    content: string;
    medium: string;
    timestamp: string;

    _links: {
        sender: IReferencer;
        student: IReferencer;
        template: IReferencer;

        communication: IReferencer;
        self: IReferencer;
    };
}

/**
 * Empty [ICommunication] object that can be used to render even when no communication was found.
 * Reduces null/ undefined checks.
 */
export const emptyCommunication: ICommunication = {
    medium: "",
    timestamp: "",
    content: "",
    _links: {
        student: { href: "" },
        communication: { href: "" },
        template: { href: "" },
        self: { href: "" },
        sender: { href: "" },
    },
};

/**
 * The collection name of communications.
 */
export const communicationCollectionName: string = "communications";

/**
 * Type describing the shape of a communications page.
 */
export type ICommunicationPage = IPage<{ communications: ICommunication[] }>;

/**
 * Type describing the shape of communications links.
 */
export type ICommunicationLinks = IEntityLinks<{ communications: ICommunication[] }>;

/**
 * The communication medium that is used by default.
 */
export const defaultCommunicationMedium = "email";

/**
 * Constructor that allows us to easily post Communication entities to our backend.
 */
export class Communication {
    constructor(medium: string, template: string, content: string, sender: string, student: string) {
        this.medium = medium;
        this.template = template;
        this.content = content;
        this.sender = sender;
        this.student = student;
    }

    medium: string;
    template: string;
    content: string;
    sender: string;
    student: string;
}
