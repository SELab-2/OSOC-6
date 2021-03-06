import {
    basePatch,
    AxiosConf,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { Edition, editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";
import axios from "axios";
import { AxiosResponse } from "axios";

/**
 * Fetches all editions on a given EditionLinksUrl.
 * @param url the url hosting the edition.
 */
export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

/**
 * Fetches an edition by its url.
 * @param url the url hosting the edition.
 */
export function getEditionOnUrl(url: string): Promise<IEdition> {
    return <Promise<IEdition>>getEntityOnUrl(url);
}

/**
 * Fetches an edition by its name.
 * @param editionName the name of the edition that must be searched.
 */
export async function getEditionByName(editionName: string): Promise<IEdition | undefined> {
    const editions = await getAllEditionsFromPage(
        getQueryUrlFromParams(apiPaths.editionByName, {
            name: editionName,
        })
    );
    return editions[0];
}

/**
 * Changes the name of an edition.
 * @param url the url hosting the edition.
 * @param name the new name of the edition.
 */
export function saveEditionName(url: string, name: string): Promise<AxiosResponse> {
    return basePatch(url, { name: name });
}

/**
 * Changes the year of an edition.
 * @param url the url hosting the edition.
 * @param year the new year of the edition.
 */
export function saveEditionYear(url: string, year: string): Promise<AxiosResponse> {
    return basePatch(url, { year: year });
}

/**
 * Changes the active-state of an edition.
 * @param url the url hosting the edition.
 * @param active the new state of the edition.
 */
export function saveEditionActiveState(url: string, active: boolean): Promise<AxiosResponse> {
    return basePatch(url, { active: active });
}

/**
 * Extract the id from a Edition url
 * @param url the url that we want the id from
 */
export function extractIdFromEditionUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}

/**
 * Function posting creating a edition on the backend.
 * @param template the edition that needs to be created.
 */
export async function createNewEdition(template: Edition): Promise<IEdition> {
    return <Promise<IEdition>>(await basePost(apiPaths.editions, template)).data;
}

/**
 * Delete an edition.
 * @param url of the edition
 */
export function editionDelete(url: string) {
    return axios.delete(url, AxiosConf);
}
