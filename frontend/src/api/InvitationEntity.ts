import { IBaseEntity, IPage, IReferencer } from "./BaseEntities";

export interface IInvitation extends IBaseEntity {
    token: string;
    creationTimestamp: string;
    used: boolean;

    _links: {
        edition: IReferencer;
        issuer: IReferencer;
        subject: IReferencer;
        self: IReferencer;
        invitation: IReferencer;
    };
}

export type IInvitationsPage = IPage<{ invitations: IInvitation[] }>;

export class Invitation {
    constructor(issuer: string, edition: string) {
        this.issuer = issuer;
        this.edition = edition;
    }

    edition: string;
    issuer: string;
}
