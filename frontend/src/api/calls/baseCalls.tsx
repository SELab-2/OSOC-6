import apiPaths from "../../properties/apiPaths";
import { IBaseEntity, IPage } from "../entities/BaseEntities";
import axios from "axios";

export const AxiosConf = { baseURL: apiPaths.base };

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

export async function getEntityOnUrl(entityUrl: string): Promise<IBaseEntity> {
    return (await axios.get(entityUrl, AxiosConf)).data;
}

export async function getEntitiesWithCache(
    urls: string[],
    cache: { [url: string]: IBaseEntity }
): Promise<IBaseEntity[]> {
    // Register when starting fetch and build cache first. This way we have no problems fighting the event loop.
    const fetched: Set<string> = new Set();
    await Promise.all(
        urls.map(async (url) => {
            if (!cache[url] && !fetched.has(url)) {
                fetched.add(url);
                cache[url] = await getEntityOnUrl(url);
            }
        })
    );
    return urls.map((url) => cache[url]);
}
