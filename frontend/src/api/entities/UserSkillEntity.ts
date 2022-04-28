import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface IUserSkill extends IBaseEntity {
    name: string;
    additionalInfo: string;

    _links: {
        userEntity: IReferencer;
        userSkill: IReferencer;
        self: IReferencer;
    };
}

export const userSkillCollectionName: string = "user-skills";
export type IUserSkillPage = IPage<{ "user-skills": IUserSkill[] }>;
export type IUserSkillLinks = IEntityLinks<{ "user-skills": IUserSkill[] }>;

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
