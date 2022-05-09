import { baseSkillType, ISkillType } from "../api/entities/SkillTypeEntity";
import useSWR from "swr";
import { getAllSkillTypesFromPage } from "../api/calls/skillTypeCalls";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";
import { CommonSWRConfig } from "./shared";

/**
 * Get the skillType entity provided the name of a Skill. If the name does not match, [baseSkillType] will be used.
 * @param name the name on which to search for the [ISkillType].
 */
export default function useSkillTypeByName(
    name: string,
    config?: CommonSWRConfig
): { data?: ISkillType; error?: Error } {
    const { data: matchingName, error: matchNameError } = useSWR(
        getQueryUrlFromParams(apiPaths.skillTypesByName, { name: name }),
        getAllSkillTypesFromPage,
        config
    );
    const { data: defaultSkillType, error: defaultSkillTypeError } = useSWR(
        !matchingName || matchingName.length === 0
            ? null
            : getQueryUrlFromParams(apiPaths.skillTypesByName, { name: baseSkillType }),
        getAllSkillTypesFromPage
    );

    if (matchNameError || defaultSkillTypeError) {
        return {
            error: matchNameError || defaultSkillTypeError,
        };
    }
    return {
        data: matchingName?.at(0) || defaultSkillType?.at(0),
    };
}
