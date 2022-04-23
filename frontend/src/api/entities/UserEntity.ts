import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import axios from "axios";
import { AxiosConf } from "../calls/baseCalls";

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

export const userCollectionName: string = "users";
export type IUsersPage = IPage<{ users: IUser[] }>;
export type IUsersLinks = IEntityLinks<{ users: IUser[] }>;

export enum UserRole {
    admin = "ADMIN",
    coach = "COACH",
}

export interface IAuthority {
    authority: UserRole;
}

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

export async function getUserInfo(url: string): Promise<IUser> {
    return (
        await axios.get(url, {
            ...AxiosConf,
        })
    ).data;
}

/**
 * Gives an empty user json. Needed in for user profile.
 */
export function getEmtpyUser(): IUser {
    return {
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
}
