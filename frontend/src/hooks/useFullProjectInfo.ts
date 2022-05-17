import { IProject } from "../api/entities/ProjectEntity";
import { IUser } from "../api/entities/UserEntity";
import { getAllProjectSkillsFromLinks } from "../api/calls/projectSkillCalls";
import { getProjectOnUrl } from "../api/calls/projectCalls";
import useSWR from "swr";
import { CommonSWRConfig } from "./shared";
import { getAllUsersFromLinks } from "../api/calls/userCalls";
import { IProjectSkill } from "../api/entities/ProjectSkillEntity";

/**
 * Interface describing the shape of a single full Project type.
 */
export interface IFullProjectInfo {
    info?: IProject;
    coaches: IUser[];
    skills: IProjectSkill[];
}

/**
 * SWR based hook returning a [IFullProjectInfo].
 * @param url the url hosting the [IProject] entity that should be completed.
 * @param config [CommonSWRConfig] config that allows to set shared SWR configurations.
 */
export default function useFullProjectInfo(
    url: string,
    config?: CommonSWRConfig
): { data?: IFullProjectInfo; error?: Error } {
    const { data: project, error: projectError } = useSWR(url, getProjectOnUrl, config);
    const { data: coaches, error: coachesError } = useSWR(
        project ? project._links.coaches.href : null,
        getAllUsersFromLinks,
        config
    );
    const { data: neededSkills, error: neededSkillsError } = useSWR(
        project ? project._links.neededSkills.href : null,
        getAllProjectSkillsFromLinks,
        config
    );
    return {
        data: {
            info: project,
            coaches: coaches || [],
            skills: neededSkills || [],
        },
        error: projectError || coachesError || neededSkillsError,
    };
}
