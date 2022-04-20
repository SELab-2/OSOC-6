import { getAllEntitiesFromLinksPage } from "./baseCalls";
import { IProjectSkill, projectSkillCollectionName } from "../entities/ProjectSkillEntity";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectSkillsFormLinks(url: string): Promise<IProjectSkill[]> {
    return <Promise<IProjectSkill[]>>getAllEntitiesFromLinksPage(url, projectSkillCollectionName);
}
