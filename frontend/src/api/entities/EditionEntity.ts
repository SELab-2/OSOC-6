import { IBaseEntity, IEntityLinks, IPage, IReferencer } from "./BaseEntities";
import { ICommunication } from "./CommunicationEntity";

export interface IEdition extends IBaseEntity {
    name: string;
    year: number;
    active: boolean;

    _links: {
        edition: IReferencer;
        self: IReferencer;
    };
}

export const editionCollectionName: string = "editions";
export type IEditionsPage = IPage<{ editions: IEdition[] }>;
export type IEditionsLinks = IEntityLinks<{ editions: IEdition[] }>;

export class Edition {
    constructor(name: string, year: number, active: boolean) {
        this.name = name;
        this.active = active;
        this.year = year;
    }

    active: boolean;
    name: string;
    year: number;
}

/**
 * Empty [IEdition] object that can be used to render even when no edition was found.
 * Reduces null/ undefined checks.
 */
export const emptyEdition: IEdition = {
    name: "",
    year: 0,
    active: false,
    _links: {
        edition: { href: "" },
        self: { href: "" },
    },
};
