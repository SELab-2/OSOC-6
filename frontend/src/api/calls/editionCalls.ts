import {
    AxiosConf,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";
import { IBaseEntity } from "../entities/BaseEntities";
import axios from "axios";

export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}

export async function getEditionByName(editionName: string): Promise<IEdition | undefined> {
    const editions = await getAllEditionsFromPage(
        getQueryUrlFromParams(apiPaths.editionByName, {
            name: editionName,
        })
    );
    return editions[0];
}

/**
 * Get an [IEdition] from a URL.
 * @param url the url where the [IEdition] is hosted on
 */
export function getEditionOnUrl(url: string): Promise<IEdition | undefined> {
    return <Promise<IEdition>>getEntityOnUrl(url);
}

export function extractIdFromEditionUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
