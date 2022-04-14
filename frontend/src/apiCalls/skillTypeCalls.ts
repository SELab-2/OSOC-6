import { IUserSkill } from "../apiEntities/UserSkillEntity";
import { IProjectSkill } from "../apiEntities/ProjectSkillEntity";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "./requests";
import { baseSkillType, ISkillType, ISkillTypePage } from "../apiEntities/SkillTypeEntity";

/**
 * Get the skillType for a certain Skill.
 * @param skill The skill you want the skillTypeFrom
 */
export async function getSkillTypeFromSkill(
    skill: IUserSkill | IProjectSkill
): Promise<ISkillType> {
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
