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
        // URI-list is needed even when you send only one URI.
        // You just need to specify the content is a URI and not json.
        // Data should be a list of newline seperated URIs.
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

export function removeParamFormUrl(url: string, param: string): string {
    if (!(url.includes("?" + param + "=") || url.includes("&" + param + "="))) {
        return url;
    }
    return url
        .replace(new RegExp(param + "=[^&]*"), "")
        .replace("?&", "?")
        .replace("&&", "&")
        .replace(/[?&]$/, "");
}

export function getParamsFromQueryUrl(url: string): { [k: string]: any } {
    if (url.includes("?")) {
        const urlQuery = url.split("?")[1];
        let params = new Map();
        for (const param of urlQuery.split("&")) {
            const parameter: string[] = param.split("=");
            params.set(parameter[0], parameter[1]);
        }
        return params;
    }
    return {};
}

/**
 * Function performing a POST on the provided url with the [AxiosConf].
 * @param url to perform the POST on.
 * @param data the data that should be contained in the POST.
 * @param params that should be added to the POST query.
 */
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

/**
 * Function performing a PATCH on the provided url with the [AxiosConf].
 * @param url to perform the PATCH on.
 * @param data the data that should be contained in the PATCH.
 * @param params that should be added to the PATCH query.
 */
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

/**
 * Function performing a DELETE on the provided url with the [AxiosConf].
 * @param url to perform the DELETE on.
 * @param params that should be added to the DELETE query.
 */
export function baseDelete(url: string, params?: { [k: string]: any }): Promise<AxiosResponse<any, any>> {
    return axios.delete(url, {
        params: params,
        ...AxiosConf,
    });
}

/**
 * Extracts the id of a [IBaseEntity] from a URL hosting a single [IBaseEntity].
 * If the url is invalid, this will return the invalid id 0.
 * @param url hosting the [IBaseEntity].
 */
export function extractIdFromApiEntityUrl(url: string): string {
    const split = url.split("/");
    return split[split.length - 1] || "0";
}
