import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import axios from "axios";
import { AxiosConf } from "./requests";

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
