import { IProject, Project, projectCollectionName } from "../entities/ProjectEntity";
import { baseDelete, basePost, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFromPage(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}

export async function createProject(project: Project): Promise<IProject> {
    return (await basePost(apiPaths.projects, project)).data;
}

/**
 * Removes a project from the database
 * @param url hosting the [IProject]
 */
export async function deleteProject(url: string) {
    return await baseDelete(url);
}
