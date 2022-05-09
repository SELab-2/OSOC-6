import { IProject, projectCollectionName } from "../entities/ProjectEntity";
import { getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFormPage(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}
