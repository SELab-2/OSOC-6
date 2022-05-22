import { IProject, Project, projectCollectionName } from "../entities/ProjectEntity";
import {
    baseDelete,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    ManyToManyAxiosConf,
} from "./baseCalls";
import apiPaths from "../../properties/apiPaths";
import axios, { AxiosResponse } from "axios";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFromPage(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}

/**
 * Creates a new project and returns the new project.
 * @param project [Project] that needs to be created.
 */
export async function createProject(project: Project): Promise<IProject | undefined> {
    const newProject = (await basePost(apiPaths.projects, project)).data;
    return newProject?._links ? newProject : undefined;
}

/**
 * Edits an existing project and returns the new values.
 * @param url url the existing project is hosted on.
 * @param project [Project] that needs to be created.
 */
export async function editProject(url: string, project: Project): Promise<IProject | undefined> {
    const newProject = (await basePatch(url, project)).data;
    return newProject?._links ? newProject : undefined;
}

/**
 * Function that configures the coaches of a given project.
 * @param project [IProject] of which the coaches need to be set.
 * @param coachUrls list of URLs to the coaches.
 */
export function setProjectCoaches(project: IProject, coachUrls: string[]): Promise<AxiosResponse<any, any>> {
    const coaches = coachUrls.join("\n");
    return axios.put(project._links.coaches.href, coaches, ManyToManyAxiosConf);
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
