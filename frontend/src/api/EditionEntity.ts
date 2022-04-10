import { BaseEntity, Page, Referencer } from './BaseEntities';

export interface IEdition extends BaseEntity {
    name: string;
    year: number;
    active: boolean;

    _links: {
        edition: Referencer;
        self: Referencer;
    };
}

export type EditionsPage = Page<{ editions: IEdition[] }>;

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
