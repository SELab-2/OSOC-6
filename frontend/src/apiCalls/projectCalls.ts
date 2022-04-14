import { getAllEntitiesFromLinksPage } from "./requests";
import { IProject, projectCollectionName } from "../apiEntities/ProjectEntity";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFormLinks(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromLinksPage(url, projectCollectionName);
}
