import { IBaseEntity, IPage, IReferencer } from './BaseEntities';

export interface IUserSkill extends IBaseEntity {
    name: string;
    additionalInfo: string;

    _links: {
        userEntity: IReferencer;
        userSkill: IReferencer;
        self: IReferencer;
    };
}

export type IUserSkillPage = IPage<{ 'user-skills': IUserSkill[] }>;

export class UserSkill {
    constructor(name: string, additionalInfo: string, userEntity: string) {
        this.name = name;
        this.additionalInfo = additionalInfo;
        this.userEntity = userEntity;
    }

    additionalInfo: string;
    name: string;
    userEntity: string;
}
