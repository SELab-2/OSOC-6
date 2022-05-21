import {
    basePatch,
    basePost,
    getAllEntitiesFromLinksUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
} from "./baseCalls";
import { IProjectSkill, ProjectSkill, projectSkillCollectionName } from "../entities/ProjectSkillEntity";
import { Project } from "../entities/ProjectEntity";
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
export async function createProjectSkill(projectSkill: ProjectSkill): Promise<IProjectSkill | undefined> {
    const newProjectSkill = (await basePost(apiPaths.projectSkills, projectSkill)).data;
    return newProjectSkill?._links ? newProjectSkill : undefined;
}

/**
 * Function editing the content of a project skill. Leaves the relationships as is.
 * @param url the URL on which the [IProjectSkill] is hosted.
 * @param projectSkill data that should be posted.
 */
export async function editProjectSkill(
    url: string,
    projectSkill: ProjectSkill
): Promise<IProjectSkill | undefined> {
    const newProjectSkill = (
        await basePatch(url, { name: projectSkill.name, additionalInfo: projectSkill.additionalInfo })
    ).data;
    return newProjectSkill?._links ? newProjectSkill : undefined;
}

/**
 * Function getting an [IProjectSkill] entity on the provided url.
 * @param url the url hosting the [IProjectSkill] entity.
 */
export function getProjectSkillOnUrl(url: string): Promise<IProjectSkill> {
    return <Promise<IProjectSkill>>getEntityOnUrl(url);
}
