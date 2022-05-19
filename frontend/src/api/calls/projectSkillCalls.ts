import { basePost, getAllEntitiesFromLinksUrl, getAllEntitiesFromPage } from "./baseCalls";
import { IProjectSkill, ProjectSkill, projectSkillCollectionName } from "../entities/ProjectSkillEntity";
import { IProject, Project } from "../entities/ProjectEntity";
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
