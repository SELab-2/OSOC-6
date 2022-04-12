import { IBaseEntity, IPage, IReferencer } from "./BaseEntities";

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

export type ICommunicationPage = IPage<{ communications: ICommunication[] }>;

export class Communication {
    constructor(
        medium: string,
        template: string,
        content: string,
        sender: string,
        student: string
    ) {
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
