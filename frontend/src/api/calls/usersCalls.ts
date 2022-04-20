import { getAllEntitiesFromLinksPage } from "./baseCalls";
import { IUser, userCollectionName } from "../entities/UserEntity";

/**
 * Fetches all users on a url hosting IEntityLinks
 */
export function getAllUsers(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromLinksPage(url, userCollectionName);
}
