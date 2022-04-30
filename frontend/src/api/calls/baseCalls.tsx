import apiPaths from "../../properties/apiPaths";
import { IBaseEntity, IEntityLinks, IPage } from "../entities/BaseEntities";
import axios, { AxiosRequestConfig } from "axios";
import { FetcherResponse, PublicConfiguration } from "swr/dist/types";
import { extractIdFromEditionUrl, useCurrentEdition } from "./editionCalls";
import useSWR from "swr";

export const AxiosConf: AxiosRequestConfig = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
};

export const AxiosFormConfig: AxiosRequestConfig = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "multipart/form-data",
        "access-control-allow-origin": "*",
    },
};

/**
 * Gets all IBaseEntities on an url hosting IEntityLinks
 * @param pageUrl url hosting the IPage
 * @param collectionName name of the collection as defined in the IEntityLinks type extension.
 */
export async function getAllEntitiesFromPage(
    pageUrl: string,
    collectionName: string
): Promise<IBaseEntity[]> {
    let fetchedAll: boolean = false;
    let currentPage: number = 0;
    const entities: IBaseEntity[] = [];

    while (!fetchedAll) {
        const page: IPage<{ [k: string]: IBaseEntity[] }> = (
            await axios.get(pageUrl, {
                params: {
                    size: 1000,
                    page: currentPage,
                },
                ...AxiosConf,
            })
        ).data;
        entities.push(...page._embedded[collectionName]);
        fetchedAll = currentPage + 1 >= page.page.totalPages;
        currentPage++;
    }
    return entities;
}

export async function getAllEntitiesFromLinksUrl(
    linksUrl: string,
    collectionName: string
): Promise<IBaseEntity[]> {
    const linksData: IEntityLinks<{ [k: string]: IBaseEntity[] }> = (await axios.get(linksUrl, AxiosConf))
        .data;
    return linksData._embedded[collectionName];
}

export function useSwrWithEdition<T>(
    key: string | null,
    fetcher: ((args_0: string) => FetcherResponse<T>) | null,
    config?: Partial<PublicConfiguration<T, any, (args_0: string) => FetcherResponse<T>>>
) {
    const edition = useCurrentEdition(true);
    return useSWR(
        key
            ? getQueryUrlFromParams(key, {
                  edition: edition ? extractIdFromEditionUrl(edition._links.self.href) : undefined,
              })
            : null,
        fetcher,
        config
    );
}

export async function getEntityOnUrl(entityUrl: string): Promise<IBaseEntity | undefined> {
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

export function getQueryUrlFromParams(url: string, params: { [k: string]: any }): string {
    let urlConstructor = url.indexOf("?") === -1 ? url + "?" : url;
    for (const key in params) {
        urlConstructor += key + "=" + encodeURIComponent(params[key]) + "&";
    }
    urlConstructor =
        urlConstructor[urlConstructor.length - 1] === "&"
            ? urlConstructor.substring(0, urlConstructor.length - 1)
            : urlConstructor;
    return urlConstructor;
}

export function getParamsFromQueryUrl(url: string): { [k: string]: any } {
    const urlQuery = url.split("?")[1];
    let params = new Map();
    for (const param of urlQuery.split("&")) {
        const parameter: string[] = param.split("=");
        params.set(parameter[0], parameter[1]);
    }
    return params;
}

export async function basePost(url: string, data: any, params: { [k: string]: any }) {
    return await axios.post(url, data, {
        params: params,
        ...AxiosConf,
    });
}
