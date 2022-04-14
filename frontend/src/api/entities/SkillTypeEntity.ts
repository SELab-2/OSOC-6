import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import { IUserSkill } from "./UserSkillEntity";
import { IProjectSkill } from "./ProjectSkillEntity";
import axios from "axios";
import apiPaths from "../../properties/apiPaths";
import { AxiosConf } from "../calls/requests";

export interface ISkillType extends IBaseEntity {
    name: string;
    colour: string;

    _links: {
        skillType: IReferencer;
        self: IReferencer;
    };
}

export const skillTypeCollectionName: string = "skillTypes";
export type ISkillTypePage = IPage<{ skillTypes: ISkillType[] }>;
export type ISkillTypeLinks = IEntityLinks<{ skillTypes: ISkillType[] }>;

export const baseSkillType: string = "other";

export class SkillType {
    constructor(name: string, colour: string) {
        this.name = name;
        this.colour = colour;
    }

    name: string;
    colour: string;
}
