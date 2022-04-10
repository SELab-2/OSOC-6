import { IBaseEntity, IPage, IReferencer } from './BaseEntities';

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

export enum UserRole {
    admin = 'ADMIN',
    coach = 'COACH',
}

export interface IAuthority {
    authority: UserRole;
}
