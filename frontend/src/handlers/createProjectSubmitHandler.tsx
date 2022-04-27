import apiPaths from "../properties/apiPaths";
import Router from "next/router";
import axios from "axios";
import { AxiosConf, AxiosFormConfig } from "../api/calls/baseCalls";
import { Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";

export interface ProjectCreationValues {
    projectName: string;
    projectInfo: string;
    versionManagement: string;
    coaches: string[];
    partnerName: string;
    partnerWebsite: string;
    skills: string[];
    skillInfos: string[];
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
        "/" + ownUser.data._links.self.href.split(apiPaths.base)[1]
    );

    const projectResponse = await axios.post(apiPaths.projects, project, AxiosConf);
    const projectURI: string = "/" + projectResponse.data._links.self.href.split(apiPaths.base)[1];

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

    await axios.patch(projectResponse.data._links.coaches.href, { users: values.coaches }, AxiosConf);

    await Router.push(
        "/" + applicationPaths.projects + "/" + projectResponse.data._links.self.href.split("/").pop()
    );
}
