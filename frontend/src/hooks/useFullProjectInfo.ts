import { IProject } from "../api/entities/ProjectEntity";
import { IUser } from "../api/entities/UserEntity";
import { getAllProjectSkillsFromLinks, IFullProjectSkill } from "../api/calls/projectSkillCalls";
import { getProjectOnUrl } from "../api/calls/projectCalls";
import useSWR from "swr";
import { CommonSWRConfig } from "./shared";
import { getAllUsersFromLinks } from "../api/calls/userCalls";
import { IProjectSkill } from "../api/entities/ProjectSkillEntity";

export interface IFullProjectInfo {
    info?: IProject;
    coaches: IUser[];
    skills: IProjectSkill[];
}

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
    if (projectError || coachesError || neededSkillsError) {
        return {
            error: projectError || coachesError || neededSkillsError,
        };
    }
    return {
        data: {
            info: project,
            coaches: coaches || [],
            skills: neededSkills || [],
        },
    };
}
