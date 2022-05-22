import { baseSkillType, ISkillType } from "../api/entities/SkillTypeEntity";
import useSWR from "swr";
import { getAllSkillTypesFromPage } from "../api/calls/skillTypeCalls";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import apiPaths from "../properties/apiPaths";
import { CommonSWRConfig } from "./shared";
import { useSwrForEntityList } from "./utilHooks";

/**
 * SWR based hook returning a [ISkillType] that with the matching name or the default if no matching is found.
 * @param name the name of the skill the skillType is search of.
 * @param config [CommonSWRConfig] config that allows to set shared SWR configurations.
 */
export default function useSkillTypeByName(
    name: string,
    config?: CommonSWRConfig
): { data?: ISkillType; error?: Error } {
    const { data: matchingName, error: matchNameError } = useSwrForEntityList(
        getQueryUrlFromParams(apiPaths.skillTypesByName, { name: name }),
        getAllSkillTypesFromPage,
        config
    );
    const { data: defaultSkillType, error: defaultSkillTypeError } = useSwrForEntityList(
        !matchingName || matchingName.length === 0
            ? null
            : getQueryUrlFromParams(apiPaths.skillTypesByName, { name: baseSkillType }),
        getAllSkillTypesFromPage
    );

    return {
        data: matchingName ? matchingName[0] : defaultSkillType ? defaultSkillType[0] : undefined,
        error: matchNameError || defaultSkillTypeError,
    };
}
