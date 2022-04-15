import { getAllEntitiesFromLinksPage } from "./baseCalls";
import { IUser, userCollectionName } from "../entities/UserEntity";

/**
 * Fetches all users
 */
export function getAllUsers(url: string): Promise<IUser[]> {
    return <Promise<IUser[]>>getAllEntitiesFromLinksPage(url, userCollectionName);
}
