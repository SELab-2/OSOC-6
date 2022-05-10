import { IProject, Project, projectCollectionName } from "../entities/ProjectEntity";
import { basePost, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import apiPaths from "../../properties/apiPaths";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFormPage(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}

export async function createProject(project: Project): Promise<IProject> {
    return (await basePost(apiPaths.projects, project)).data;
}
