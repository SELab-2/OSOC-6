import {
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getQueryUrlFromParams,
} from "./baseCalls";
import { Edition, editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Get all editions from a page
 * @param url that returns all editions
 */
export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

/**
 * Function that gets an edition by name
 * @param editionName the name of the edition
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
 * Function that extracts the id given the url of an edition
 * @param url of the edition
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
