import pathNames from "../properties/pathNames";
import { IBaseEntity, IPage } from "./BaseEntities";
import axios from "axios";

export const AxiosConf = { baseURL: pathNames.base };

export const AxiosFormConfig = {
    baseURL: pathNames.base,
    headers: {
        "Content-Type": "multipart/form-data",
        "access-control-allow-origin": "*",
    },
};

export async function getAllEntities(url: string, collectionName: string): Promise<IBaseEntity[]> {
    let fetchedAll: boolean = false;
    let currentPage: number = 0;
    const entities: IBaseEntity[] = [];

    while (!fetchedAll) {
        const page: IPage<{ [k: string]: IBaseEntity[] }>;
        page = (
            await axios.get(url, {
                params: {
                    size: 1000,
                    page: currentPage,
                },
                ...AxiosConf,
            })
        ).data;
        entities.push(...page._embedded[collectionName]);
        fetchedAll = currentPage + 1 === page.page.totalPages;
        currentPage++;
    }

    return entities;
}
