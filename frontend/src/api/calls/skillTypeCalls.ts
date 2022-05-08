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
import {
    AxiosConf,
    getAllEntitiesFromLinksUrl,
    getAllEntitiesFromPage,
    getQueryUrlFromParams,
} from "./baseCalls";

export async function getSkillTypeByName(skillName: string): Promise<ISkillType> {
    let type: ISkillTypePage = (
        await axios.get(getQueryUrlFromParams(apiPaths.skillTypesByName, { name: skillName }), AxiosConf)
    ).data;
    if (type._embedded.skillTypes.length == 0) {
        type = (
            await axios.get(
                getQueryUrlFromParams(apiPaths.skillTypesByName, { name: baseSkillType }),
                AxiosConf
            )
        ).data;
    }
    return type._embedded.skillTypes[0];
}

/**
 * Get the skillType for a certain Skill.
 * @param skill The skill you want the skillTypeFrom
 */
export function getSkillTypeFromSkill(skill: IUserSkill | IProjectSkill): Promise<ISkillType> {
    return getSkillTypeByName(skill.name);
}

/**
 * Fetches all SkillTypes on a given SkillTypeLinksUrl
 */
export function getAllSkillTypesFromLinks(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromLinksUrl(url, skillTypeCollectionName);
}

export function getAllSkillTypesFromPage(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromPage(url, skillTypeCollectionName);
}
