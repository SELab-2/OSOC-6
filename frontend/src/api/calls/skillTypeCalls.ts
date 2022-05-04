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
import { AxiosConf, getAllEntitiesFromLinksUrl } from "./baseCalls";

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

export async function getSkillTypeWithName(skillName: string): Promise<ISkillType> {
    console.log(skillName.slice(0, 20));
    let skills = await getAllSkillTypesFromLinks(apiPaths.skillTypes);
    console.log(skills);
    const skill = skills.find((skill) => skill.name === skillName.slice(0, 20));
    console.log("Skill");
    console.log(skill);
    let skillType: ISkillType;
    if (skill == undefined) {
        skillType = await createNewSkill(skillName);
        console.log(skillType);
    } else {
        skillType = skill;
    }
    return skillType;
}

export function getRandomColor() {
    let color = Math.floor(Math.random() * 16777216).toString(16);
    return "#000000".slice(0, -color.length) + color;
}

export async function createNewSkill(skillName: string): Promise<ISkillType> {
    const skill = new SkillType(skillName.slice(0, 20), getRandomColor());
    return (await axios.post(apiPaths.skillTypes, skill, AxiosConf)).data;
}
