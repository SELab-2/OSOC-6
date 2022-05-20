import { IProject, Project, projectCollectionName } from "../entities/ProjectEntity";
import {
    baseDelete,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
} from "./baseCalls";
import apiPaths from "../../properties/apiPaths";
import {AxiosResponse} from "axios";

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
 * Extracts the id of a [IProject] from a URL hosting a single [IProject].
 * @param url hosting the [IProject].
 */
export function extractIdFromProjectUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}

/**
 * Removes a project from the database
 * @param url hosting the [IProject]
 */
export async function deleteProject(url: string): Promise<AxiosResponse> {
    return await baseDelete(url);
}
