import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage } from "./baseCalls";
import { IUser, userCollectionName } from "../entities/UserEntity";

/**
 * Fetches all users on a given UserPageUrl
 */
export function getAllUsersFromPage(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromPage(url, userCollectionName);
}

/**
 * Fetches all users on a given UserLinksUrl
 */
export function getAllUsersFromLinks(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromLinksUrl(url, userCollectionName);
}
