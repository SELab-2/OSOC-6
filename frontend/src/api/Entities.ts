export interface Referencer {
    href: string;
}

export interface BaseEntity {
    _links: { self: Referencer } | undefined;
}

export interface Page<T> {
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    _links: {
        self: Referencer;
        search: Referencer;
        profile: Referencer;
    };
    _embedded: T;
}

export type editionPage = Page<{ editions: IEdition[] }>;

export type userPage = Page<{ users: IUser[] }>;

export interface IUser extends BaseEntity {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: Authority;
    callName: string;
    credentialsNonExpired: boolean;
    email: string;
    enabled: boolean;
    userRole: UserRole;
    username: string;
}

export interface IInvitation extends BaseEntity {
    token: string | undefined;
    creationTimestamp: Date | undefined;
    edition: string;
    issuer: string;
    subject: string | undefined;
}

export class Invitation implements IInvitation {
    constructor(issuer: string, edition: string) {
        this.issuer = issuer;
        this.edition = edition;
    }

    _links: { self: { href: string } } | undefined;
    creationTimestamp: Date | undefined;
    edition: string;
    issuer: string;
    subject: string | undefined;
    token: string | undefined;
}

export interface IEdition extends BaseEntity {
    name: string;
    year: number;
    active: boolean;
}

export class Edition implements IEdition {
    constructor(name: string, year: number, active: boolean) {
        this.name = name;
        this.active = active;
        this.year = year;
    }

    _links: { self: { href: string } } | undefined;
    active: boolean;
    name: string;
    year: number;
}

export enum UserRole {
    admin = 'ADMIN',
    coach = 'COACH',
}

export interface Authority {
    authority: UserRole;
}
