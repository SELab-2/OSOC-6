import apiPaths from "../properties/apiPaths";
import Router, { NextRouter } from "next/router";
import axios from "axios";
import { AxiosConf, basePost, extractIdFromApiEntityUrl, ManyToManyAxiosConf } from "../api/calls/baseCalls";
import { Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { extractIdFromUserUrl } from "../api/calls/userCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { extractIdFromEditionUrl } from "../api/calls/editionCalls";
import { ScopedMutator } from "swr/dist/types";
import { createProject } from "../api/calls/projectCalls";

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
        editionUrl: string,
        ownUser: IUser,
        mutate: ScopedMutator<any>,
        apiURLTransformer: (url: string) => string
    ) => Promise<void>;
};

/**
 * Takes care of the creation of a new project and the associated ProjectSkills
 * @param values values needed to create a new project
 * @param router the next router object
 * @param editionUrl the current edition
 * @param ownUser the currently logged in user
 * @param mutate the global mutate function provided by SWR
 * @param apiURLTransformer function that transforms an url to an edition queried url.
 */
export async function createProjectSubmitHandler(
    values: ProjectCreationValues,
    router: NextRouter,
    editionUrl: string,
    ownUser: IUser,
    mutate: ScopedMutator<any>,
    apiURLTransformer: (url: string) => string
) {
    const project: Project = new Project(
        values.name,
        values.info,
        values.versionManagement,
        values.goals,
        values.partnerName,
        values.partnerWebsite,
        editionUrl,
        apiPaths.users + "/" + extractIdFromUserUrl(ownUser._links.self.href)
    );

    const createdProject = await createProject(project);

    const projectURI: string =
        apiPaths.projects + "/" + extractIdFromApiEntityUrl(createdProject._links.self.href);

    let projectSkills: ProjectSkill[] = [];

    for (let i: number = 0; i < values.skills.length; i++) {
        const projectSkill: ProjectSkill = new ProjectSkill(
            values.skills[i],
            values.skillInfos[i],
            projectURI
        );
        projectSkills.push(projectSkill);
    }

    await Promise.all(projectSkills.map((projectSkill) => basePost(apiPaths.projectSkills, projectSkill)));

    await Promise.all(
        values.coaches.map(
            async (coach) => await axios.put(createdProject._links.coaches.href, coach, ManyToManyAxiosConf)
        )
    );

    Promise.all([
        mutate(apiPaths.projects),
        mutate(apiURLTransformer(apiPaths.projectsByEdition)),
        mutate(createdProject._links.neededSkills),
        mutate(createdProject._links.coaches),
    ]).catch(console.log);

    await router.push(
        "/" + applicationPaths.projects + "/" + extractIdFromApiEntityUrl(createdProject._links.self.href)
    );
}
