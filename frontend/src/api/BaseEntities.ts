export interface IReferencer {
    href: string;
}

export interface IBaseEntity {
    _links: {
        self: IReferencer;
    };
}

export interface IPage<T> extends IBaseEntity {
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
    _embedded: T;
}
