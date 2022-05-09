import {
    AxiosConf,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromLinksUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
} from "./baseCalls";
import { IUser, userCollectionName } from "../entities/UserEntity";
import axios from "axios";
import apiPaths from "../../properties/apiPaths";
import useSWR, { SWRResponse } from "swr";

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

export function getOwnUser(): Promise<IUser> {
    return <Promise<IUser>>getEntityOnUrl(apiPaths.ownUser);
}

/**
 * Get user on url
 * @param url
 */
export function getUserOnUrl(url: string): Promise<IUser> {
    return <Promise<IUser>>getEntityOnUrl(url);
}

export async function logoutUser() {
    await axios.get(apiPaths.base + apiPaths.logout, AxiosConf);
}

export function useCurrentUser(shouldExec: boolean): { user?: IUser; error?: Error } {
    const { data, error } = useSWR(shouldExec ? apiPaths.ownUser : null, getOwnUser);
    if (error) {
        return { error: new Error("Not logged in") };
    }
    return { user: data };
}

export function extractIdFromUserUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
