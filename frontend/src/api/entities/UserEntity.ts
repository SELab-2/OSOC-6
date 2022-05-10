import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import axios from "axios";
import { AxiosConf } from "../calls/baseCalls";

/**
 * The roles a user can have in our back end.
 */
export enum UserRole {
    admin = "ADMIN",
    coach = "COACH",
}

/**
 * Interface that describes the shape of a user as received by the backend.
 */
export interface IUser extends IBaseEntity {
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    authorities: IAuthority;
    callName: string;
    credentialsNonExpired: boolean;
    email: string;
    enabled: boolean;
    userRole: UserRole;
    username: string;

    _links: {
        communications: IReferencer;
        projects: IReferencer;
        receivedInvitations: IReferencer;
        skills: IReferencer;
        userEntity: IReferencer;
        self: IReferencer;
    };
}

/**
 * An [IUser] that is completely empty. Using this we don't need as much ?. in our code.
 */
export const emptyUser: IUser = {
    accountNonExpired: true,
    accountNonLocked: true,
    authorities: { authority: UserRole.coach },
    callName: "",
    credentialsNonExpired: true,
    email: "",
    enabled: true,
    userRole: UserRole.coach,
    username: "",

    _links: {
        communications: { href: "" },
        projects: { href: "" },
        receivedInvitations: { href: "" },
        skills: { href: "" },
        userEntity: { href: "" },
        self: { href: "" },
    },
};

/**
 * The collection name of users.
 */
export const userCollectionName: string = "users";

/**
 * Type describing the shape of a users page.
 */
export type IUsersPage = IPage<{ users: IUser[] }>;

/**
 * Type describing the shape of user links.
 */
export type IUsersLinks = IEntityLinks<{ users: IUser[] }>;

/**
 * Interface describing the shape of the authority object received from the backend.
 */
export interface IAuthority {
    authority: UserRole;
}

/**
 * Constructor that allows us to easily post User entities to our backend.
 */
export class User {
    constructor(callName: string, email: string, password: string) {
        this.callName = callName;
        this.email = email;
        this.password = password;
    }

    callName: string;
    email: string;
    password: string;
}
