import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import { IUserSkill } from "./UserSkillEntity";
import { IProjectSkill } from "./ProjectSkillEntity";
import axios from "axios";
import pathNames from "../properties/pathNames";
import { AxiosConf } from "./requests";

export interface ISkillType extends IBaseEntity {
    name: string;
    colour: string;

    _links: {
        skillType: IReferencer;
        self: IReferencer;
    };
}

export async function getSkillTypeFromSkill(
    skill: IUserSkill | IProjectSkill
): Promise<ISkillType> {
    let type: ISkillTypePage = (
        await axios.get(pathNames.skillTypesByName, {
            params: {
                name: skill.name,
            },
            ...AxiosConf,
        })
    ).data;
    if (type._embedded.skillTypes.length == 0) {
        type = (
            await axios.get(pathNames.skillTypesByName, {
                params: {
                    name: "other",
                },
                ...AxiosConf,
            })
        ).data;
    }
    return type._embedded.skillTypes[0];
}

export type ISkillTypePage = IPage<{ skillTypes: ISkillType[] }>;
export type ISkillTypeLinks = IEntityLinks<{ skillTypes: ISkillType[] }>;

export class SkillType {
    constructor(name: string, colour: string) {
        this.name = name;
        this.colour = colour;
    }

    name: string;
    colour: string;
}
