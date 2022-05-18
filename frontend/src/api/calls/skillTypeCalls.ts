import { ISkillType, SkillType, skillTypeCollectionName } from "../entities/SkillTypeEntity";
import {
    AxiosConf,
    baseDelete,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromLinksUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
} from "./baseCalls";
import apiPaths from "../../properties/apiPaths";
import { IBaseEntity } from "../entities/BaseEntities";
import axios from "axios";

/**
 * Fetches all SkillTypes on a given SkillTypeLinksUrl
 */
export function getAllSkillTypesFromLinks(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromLinksUrl(url, skillTypeCollectionName);
}

/**
 * Get a [ISkillType] from a URL.
 * @param skillTypeUrl the url where the [ISkillType] is hosted on
 */
export function getSkillTypeOnUrl(skillTypeUrl: string): Promise<ISkillType | undefined> {
    return <Promise<ISkillType>>getEntityOnUrl(skillTypeUrl);
}

/**
 * Gets all [ISkillType] entities on an url hosting [IPage].
 * @param url url hosting the IPage
 */
export function getAllSkillTypesFromPage(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromPage(url, skillTypeCollectionName);
}

/**
 * Function creating a new [ISkillType] entity.
 * @param skillType skillType that should be created.
 */
export async function createSkillType(skillType: SkillType): Promise<ISkillType> {
    return (await basePost(apiPaths.skillTypes, skillType)).data;
}

/**
 * Function editing the color of a [ISkillType] entity.
 * @param url the url the [ISkillType] that needs to be edited is hosted on.
 * @param colour the new colour of the skillType.
 */
export async function editSkillTypeColourOnUrl(url: string, colour: string): Promise<ISkillType> {
    return (await basePatch(url, { colour })).data;
}

export function deleteSkillTypeFromList(url: string, skillTypes: ISkillType[]): ISkillType[] {
    baseDelete(url).catch(console.log);
    return skillTypes.filter((skillType) => skillType._links.self.href !== url);
}

/**
 * Extracts the id of a [ISkillType] from a URL hosting a single [ISkillType].
 * @param url hosting the [ISkillType].
 */
export function extractIdFromSkillTypeUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
