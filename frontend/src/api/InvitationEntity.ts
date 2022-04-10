import { BaseEntity, Page, Referencer } from './BaseEntities';

export interface IInvitation extends BaseEntity {
    token: string | undefined;
    creationTimestamp: Date | undefined;
    used: boolean;

    _links: {
        edition: Referencer;
        issuer: Referencer;
        subject: Referencer;
        self: Referencer;
        invitation: Referencer;
    };
}

export type InvitationsPage = Page<{ invitations: IInvitation[] }>;

export class Invitation {
    constructor(issuer: string, edition: string) {
        this.issuer = issuer;
        this.edition = edition;
    }

    edition: string;
    issuer: string;
}
