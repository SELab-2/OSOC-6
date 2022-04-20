import { getAllEntitiesFromLinksPage } from "./baseCalls";
import { IUser, userCollectionName } from "../entities/UserEntity";

/**
 * Fetches all users on a given UserLinksUrl
 */
export function getAllUsersFormLinks(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromLinksPage(url, userCollectionName);
}
