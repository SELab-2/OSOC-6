export interface BaseEntity {
    _links: { self: { href : string } } | undefined
}

export interface IUser extends BaseEntity {
    accountNonExpired: boolean,
    accountNonLocked: boolean,
    authorities: Authority
    callName: string,
    credentialsNonExpired: boolean,
    email: string,
    enabled: boolean,
    userRole: UserRole,
    username: string,
}

export interface IEdition extends BaseEntity {
    name: string,
    year: number,
    active: boolean,
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
    admin = "ADMIN",
    coach = "COACH",
}

export interface Authority {
    authority: UserRole
}