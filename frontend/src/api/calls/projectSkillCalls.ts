import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage, getEntityOnUrl } from './baseCalls';
import { IProjectSkill, projectSkillCollectionName } from '../entities/ProjectSkillEntity';

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
 * Function getting an [IProjectSkill] entity on the provided url.
 * @param url the url hosting the [IProjectSkill] entity.
 */
export function getProjectSkillOnUrl(url: string): Promise<IProjectSkill> {
    return <Promise<IProjectSkill>>getEntityOnUrl(url);
}
