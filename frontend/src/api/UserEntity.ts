import { BaseEntity, Page, Referencer } from './BaseEntities';

export interface IUser extends BaseEntity {
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
        communications: Referencer;
        projects: Referencer;
        receivedInvitations: Referencer;
        skills: Referencer;
        userEntity: Referencer;
        self: Referencer;
    };
}

export type UsersPage = Page<{ users: IUser[] }>;

export enum UserRole {
    admin = 'ADMIN',
    coach = 'COACH',
}

export interface IAuthority {
    authority: UserRole;
}
