import apiPaths from "../../properties/apiPaths";
import { IBaseEntity, IEntityLinks, IPage } from "../entities/BaseEntities";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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

export const ManyToManyAxiosConf: AxiosRequestConfig = {
    baseURL: apiPaths.base,
    headers: {
        "Content-Type": "text/uri-list; charset=UTF-8",
    },
};

/**
 * Gets all IBaseEntities on an url hosting [IPage].
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

/**
 * Gets all [IBaseEntity] entities on an url hosting [IEntityLinks]
 * @param linksUrl url hosting the [IEntityLinks]
 * @param collectionName name of the collection as defined in the IEntityLinks type extension.
 */
export async function getAllEntitiesFromLinksUrl(
    linksUrl: string,
    collectionName: string
): Promise<IBaseEntity[]> {
    const linksData: IEntityLinks<{ [k: string]: IBaseEntity[] }> = (await axios.get(linksUrl, AxiosConf))
        .data;
    return linksData._embedded[collectionName];
}

/**
 * Get an [IBaseEntity] from a URL.
 * @param entityUrl the url where the [IBaseEntity] is hosted on
 */
export async function getEntityOnUrl(entityUrl: string): Promise<IBaseEntity | undefined> {
    const data: IBaseEntity = (await axios.get(entityUrl, AxiosConf)).data;
    // Needed so an error is thrown when type is wrong.
    data._links.self.href;
    return data;
}

export function getQueryUrlFromParams(url: string, params: { [k: string]: any }): string {
    let urlConstructor = url.indexOf("?") === -1 ? url + "?" : url + "&";
    for (const key in params) {
        if (params[key] !== undefined) {
            urlConstructor += key + "=" + params[key] + "&";
        }
    }
    urlConstructor = ["&", "?"].includes(urlConstructor[urlConstructor.length - 1])
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

export function basePost(
    url: string,
    data: any,
    params?: { [k: string]: any }
): Promise<AxiosResponse<any, any>> {
    return axios.post(url, data, {
        params: params,
        ...AxiosConf,
    });
}

export function basePatch(
    url: string,
    data: any,
    params?: { [k: string]: any }
): Promise<AxiosResponse<any, any>> {
    return axios.patch(url, data, {
        params: params,
        ...AxiosConf,
    });
}

export function baseDelete(url: string, params?: { [k: string]: any }): Promise<AxiosResponse<any, any>> {
    return axios.delete(url, {
        params: params,
        ...AxiosConf,
    });
}

export function extractIdFromApiEntityUrl(url: string): string {
    const split = url.split("/");
    return split[split.length - 1];
}
