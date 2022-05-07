import { IUserSkill } from "../entities/UserSkillEntity";
import { IProjectSkill } from "../entities/ProjectSkillEntity";
import axios from "axios";
import apiPaths from "../../properties/apiPaths";
import {
    baseSkillType,
    ISkillType,
    ISkillTypePage,
    SkillType,
    skillTypeCollectionName,
} from "../entities/SkillTypeEntity";
import {AxiosConf, getAllEntitiesFromLinksUrl, getAllEntitiesFromPage, getQueryUrlFromParams} from "./baseCalls";

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

export function getAllSkillTypesFromPage(url: string): Promise<ISkillType[]> {
    return <Promise<ISkillType[]>>getAllEntitiesFromPage(url, skillTypeCollectionName);
}

export async function getSkillTypeByName(skillName: string): Promise<ISkillType> {
    const skills = await getAllSkillTypesFromPage(
        getQueryUrlFromParams(apiPaths.skillTypesByName, {
            name: skillName,
        })
    );

    return skills.length == 0 ? await createNewSkill(skillName) : skills[0];
}

export function getRandomColor() {
    let color = Math.floor(Math.random() * 16777216).toString(16);
    return "#000000".slice(0, -color.length) + color;
}

export async function createNewSkill(skillName: string): Promise<ISkillType> {
    const skill = new SkillType(skillName, getRandomColor());
    return (await axios.post(apiPaths.skillTypes, skill, AxiosConf)).data;
}
