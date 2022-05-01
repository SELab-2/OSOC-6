import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import axios from "axios";
import { AxiosConf } from "../calls/baseCalls";
import { IUser } from "./UserEntity";

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

export function getSkillColorMap(skillTypes: ISkillType[]): Map<string, string> {
    let skillColorMap = new Map<string, string>();

    for (let skillType of skillTypes) {
        skillColorMap.set(skillType.name, skillType.colour);
    }

    return skillColorMap;
}

export class SkillType {
    constructor(name: string, colour: string) {
        this.name = name;
        this.colour = colour;
    }

    name: string;
    colour: string;
}
