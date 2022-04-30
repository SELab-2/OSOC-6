import { IUserSkill } from "../entities/UserSkillEntity";
import { IProjectSkill } from "../entities/ProjectSkillEntity";
import axios from "axios";
import apiPaths from "../../properties/apiPaths";
import {
    baseSkillType,
    ISkillType,
    ISkillTypePage,
    skillTypeCollectionName,
} from "../entities/SkillTypeEntity";
import { AxiosConf, getAllEntitiesFromLinksUrl, getAllEntitiesFromPage } from "./baseCalls";

/**
 * Fetches all SkillTypes on a given SkillTypePageUrl
 */
export function getAllSkillTypesFromPage(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromPage(url, skillTypeCollectionName);
}

/**
 * Get the skillType for a certain Skill.
 * @param skill The skill you want the skillTypeFrom
 */
export async function getSkillTypeFromSkill(skill: IUserSkill | IProjectSkill): Promise<ISkillType> {
    let type: ISkillTypePage = (
        await axios.get(apiPaths.skillTypesByName, {
            params: {
                name: skill.name,
            },
            ...AxiosConf,
        })
    ).data;
    if (type._embedded.skillTypes.length == 0) {
        type = (
            await axios.get(apiPaths.skillTypesByName, {
                params: {
                    name: baseSkillType,
                },
                ...AxiosConf,
            })
        ).data;
    }
    return type._embedded.skillTypes[0];
}

/**
 * Fetches all SkillTypes on a given SkillTypeLinksUrl
 */
export function getAllSkillTypesFromLinks(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromLinksUrl(url, skillTypeCollectionName);
}
