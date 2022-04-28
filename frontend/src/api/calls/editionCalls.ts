import { getAllEntitiesFromPage } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";

export function getAllEditionsFromPage(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromPage(url, editionCollectionName);
}
