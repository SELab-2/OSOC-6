import { ISkillType, skillTypeCollectionName } from "../entities/SkillTypeEntity";
import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage } from "./baseCalls";

/**
 * Fetches all SkillTypes on a given SkillTypeLinksUrl
 */
export function getAllSkillTypesFromLinks(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromLinksUrl(url, skillTypeCollectionName);
}

/**
 * Gets all [ISkillType] entities on an url hosting [IPage].
 * @param url url hosting the IPage
 */
export function getAllSkillTypesFromPage(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromPage(url, skillTypeCollectionName);
}
