import { getAllEntitiesFromLinksUrl } from "./baseCalls";
import { editionCollectionName, IEdition } from "../entities/EditionEntity";

export function getAllEditionsFromUrl(url: string): Promise<IEdition[]> {
    return <Promise<IEdition[]>>getAllEntitiesFromLinksUrl(url, editionCollectionName);
}
