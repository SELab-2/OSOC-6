import apiPaths from "../properties/apiPaths";
import Router, { NextRouter } from "next/router";
import axios from "axios";
import { AxiosConf, extractIdFromApiEntityUrl, ManyToManyAxiosConf } from "../api/calls/baseCalls";
import { Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { extractIdFromUserUrl } from "../api/calls/userCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { extractIdFromEditionUrl } from "../api/calls/editionCalls";

/**
 * All values that a project contains
 */
export interface ProjectCreationValues {
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
    creator: string;
    edition: string;
    goals: string[];
    skills: string[];
    skillInfos: string[];
    coaches: string[];
}

/**
 * All values contained directly in the Formik form
 */
export interface FormSubmitValues {
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
}

/**
 * The props that have to be passed to the component
 */
export type ProjectCreationProps = {
    submitHandler: (
        values: ProjectCreationValues,
        router: NextRouter,
        edition: IEdition,
        ownUser: IUser
    ) => void;
};

/**
 * Takes care of the creation of a new project and the associated ProjectSkills
 * @param values values needed to create a new project
 * @param router the next router object
 * @param edition the current edition
 * @param ownUser the currently logged in user
 */
export async function createProjectSubmitHandler(
    values: ProjectCreationValues,
    router: NextRouter,
    edition: IEdition,
    ownUser: IUser
) {
    const project: Project = new Project(
        values.name,
        values.info,
        values.versionManagement,
        values.goals,
        values.partnerName,
        values.partnerWebsite,
        apiPaths.editions + "/" + extractIdFromEditionUrl(edition._links.self.href),
        apiPaths.users + "/" + extractIdFromUserUrl(ownUser._links.self.href)
    );

    const projectResponse = await axios.post(apiPaths.projects, project, AxiosConf);
    const projectURI: string =
        apiPaths.projects + "/" + extractIdFromApiEntityUrl(projectResponse.data._links.self.href);

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

    await Promise.all(
        values.coaches.map(
            async (coach) =>
                await axios.put(projectResponse.data._links.coaches.href, coach, ManyToManyAxiosConf)
        )
    );

    await router.push(
        "/" +
            applicationPaths.projects +
            "/" +
            extractIdFromApiEntityUrl(projectResponse.data._links.self.href)
    );
}
