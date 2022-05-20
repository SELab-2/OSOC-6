import { basePost, getAllEntitiesFromLinksUrl, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import { IProjectSkill, ProjectSkill, projectSkillCollectionName } from "../entities/ProjectSkillEntity";
import { IProject } from "../entities/ProjectEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Fetches all projects on a given ProjectSkillPageUrl
 */
export function getAllProjectSkillsFromPage(url: string): Promise<IProjectSkill[]> {
    return <Promise<IProjectSkill[]>>getAllEntitiesFromPage(url, projectSkillCollectionName);
}

/**
 * Fetches all projects on a given ProjectSkillLinksUrl
 */
export function getAllProjectSkillsFromLinks(url: string): Promise<IProjectSkill[]> {
    return <Promise<IProjectSkill[]>>getAllEntitiesFromLinksUrl(url, projectSkillCollectionName);
}

/**
 * Creates a new projectSkill and returns the new projectSkill.
 * @param projectSkill [ProjectSkill] that needs to be created.
 */
export async function createProjectSkill(projectSkill: ProjectSkill): Promise<IProject | undefined> {
    const newProjectSkill = (await basePost(apiPaths.projectSkills, projectSkill)).data;
    return newProjectSkill?._links ? newProjectSkill : undefined;
}

/**
 * Function getting an [IProjectSkill] entity on the provided url.
 * @param url the url hosting the [IProjectSkill] entity.
 */
export function getProjectSkillOnUrl(url: string): Promise<IProjectSkill> {
    return <Promise<IProjectSkill>>getEntityOnUrl(url);
}
