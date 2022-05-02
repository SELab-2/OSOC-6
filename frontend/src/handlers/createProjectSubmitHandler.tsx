import apiPaths from "../properties/apiPaths";
import Router from "next/router";
import axios from "axios";
import {
    AxiosConf,
    AxiosFormConfig,
    getEntityFromFullUrl,
    getIdFromUrl,
    ManyToManyAxiosConf,
} from "../api/calls/baseCalls";
import { Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";

export interface ProjectCreationValues {
    projectName: string;
    projectInfo: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
    skills: string[];
    skillInfos: string[];
    coaches: string[];
}

export type ProjectCreationProps = {
    submitHandler: (values: ProjectCreationValues) => void;
};

export async function createProjectSubmitHandler(values: ProjectCreationValues) {
    const ownUser = await axios.get(apiPaths.ownUser, AxiosConf);
    const project: Project = new Project(
        values.projectName,
        values.projectInfo,
        values.versionManagement,
        [],
        values.partnerName,
        values.partnerWebsite,
        "/editions/3",
        getEntityFromFullUrl(ownUser.data._links.self.href)
    );

    const projectResponse = await axios.post(apiPaths.projects, project, AxiosConf);
    const projectURI: string = getEntityFromFullUrl(projectResponse.data._links.self.href);

    let projectSkills: ProjectSkill[] = [];

    for (let i: number = 0; i < values.skills.length; i++) {
        const projectSkill: ProjectSkill = new ProjectSkill(
            values.skills[i],
            values.skillInfos[i],
            projectURI
        );
        projectSkills.push(projectSkill);
    }

    await Promise.all(
        projectSkills.map(
            async (projectSkill) => await axios.post(apiPaths.projectSkills, projectSkill, AxiosConf)
        )
    );

    console.log([...projectSkills, values.coaches]);

    await Promise.all(
        values.coaches.map(
            async (coach) =>
                await axios.put(projectResponse.data._links.coaches.href, coach, ManyToManyAxiosConf)
        )
    );

    await Router.push(
        "/" + applicationPaths.projects + "/" + getIdFromUrl(projectResponse.data._links.self.href)
    );
}
