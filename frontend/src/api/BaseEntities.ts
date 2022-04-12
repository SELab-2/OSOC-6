export interface IReferencer {
    href: string;
}

export interface IBaseEntity {
    _links: {
        self: IReferencer;
    };
}

export interface IPage<T> extends IEntityLinks<T> {
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    _links: {
        self: IReferencer;
        search: IReferencer;
        profile: IReferencer;
    };
}

export interface IEntityLinks<T> extends IBaseEntity {
    _links: {
        self: IReferencer;
    };
    _embedded: T;
}
