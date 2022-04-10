import { IBaseEntity, IPage, IReferencer } from './BaseEntities';

export interface IEdition extends IBaseEntity {
    name: string;
    year: number;
    active: boolean;

    _links: {
        edition: IReferencer;
        self: IReferencer;
    };
}

export type IEditionsPage = IPage<{ editions: IEdition[] }>;

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
