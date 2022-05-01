import { getAllEntitiesFromPage, getQueryUrlFromParams } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";
import apiPaths from "../../properties/apiPaths";

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

export function extractIdFromEditionUrl(url: string): string {
    const split = url.split("/");
    return split[split.length - 1];
}
