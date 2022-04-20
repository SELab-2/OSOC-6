import apiPaths from "../../properties/apiPaths";
import { IBaseEntity, IPage } from "../entities/BaseEntities";
import axios from "axios";

export const AxiosConf = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
};

export const AxiosFormConfig = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "multipart/form-data",
        "access-control-allow-origin": "*",
    },
};

/**
 * Gets all IBaseEntities on an url hosting IEntityLinks
 * @param linksUrl url hosting the IEntityLinks
 * @param collectionName name of the collection as defined in the IEntityLinks type extension.
 */
export async function getAllEntitiesFromLinksPage(
    linksUrl: string,
    collectionName: string
): Promise<IBaseEntity[]> {
    let fetchedAll: boolean = false;
    let currentPage: number = 0;
    const entities: IBaseEntity[] = [];

    while (!fetchedAll) {
        const page: IPage<{ [k: string]: IBaseEntity[] }> = (
            await axios.get(linksUrl, {
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
