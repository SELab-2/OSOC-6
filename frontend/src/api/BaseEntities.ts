export interface Referencer {
    href: string;
}

export interface BaseEntity {
    _links: {
        self: Referencer;
    };
}

export interface Page<T> extends BaseEntity {
    page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
    };
    _links: {
        self: Referencer;
        search: Referencer;
        profile: Referencer;
    };
    _embedded: T;
}
