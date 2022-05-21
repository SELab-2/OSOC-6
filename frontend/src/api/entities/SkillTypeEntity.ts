import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface ISkillType extends IBaseEntity {
    name: string;
    colour: string;

    _links: {
        skillType: IReferencer;
        self: IReferencer;
    };
}

/**
 * An [ISkillType] that is completely empty. Using this we don't need as much ?. in our code.
 */
export const emptySkillType: ISkillType = {
    name: "",
    colour: "grey",

    _links: {
        skillType: { href: "" },
        self: { href: "" },
    },
};

export const skillTypeCollectionName: string = "skillTypes";
export type ISkillTypePage = IPage<{ skillTypes: ISkillType[] }>;
export type ISkillTypeLinks = IEntityLinks<{ skillTypes: ISkillType[] }>;

export const baseSkillType: string = "other";

/**
 * Returns a map, mapping the name of a SkillType to its colour
 * @param skillTypes the list of available SkillTypes
 */
export function getSkillColorMap(skillTypes: ISkillType[]): Map<string, string> {
    const skillColorMap = new Map<string, string>();

    for (const skillType of skillTypes) {
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
