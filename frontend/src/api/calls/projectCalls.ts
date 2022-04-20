import { IProject, projectCollectionName } from "../entities/ProjectEntity";
import { getAllEntitiesFromLinksPage, getEntityOnUrl } from "./baseCalls";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFormLinks(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromLinksPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}
