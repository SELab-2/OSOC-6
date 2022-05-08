import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";

export interface ISkillType extends IBaseEntity {
    name: string;
    colour: string;

    _links: {
        skillType: IReferencer;
        self: IReferencer;
    };
}

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

export class SkillType {
    constructor(name: string, colour: string) {
        this.name = name;
        this.colour = colour;
    }

    name: string;
    colour: string;
}
