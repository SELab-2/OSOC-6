import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage } from "./baseCalls";
import { IProjectSkill, projectSkillCollectionName } from "../entities/ProjectSkillEntity";
import { ISkillType } from "../entities/SkillTypeEntity";
import { IStudent } from "../entities/StudentEntity";

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
