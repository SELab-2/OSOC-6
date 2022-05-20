import apiPaths from "../properties/apiPaths";
import Router, { NextRouter } from "next/router";
import axios from "axios";
import {
    AxiosConf,
    baseDelete,
    basePost,
    extractIdFromApiEntityUrl,
    ManyToManyAxiosConf,
} from "../api/calls/baseCalls";
import { IProject, Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { extractIdFromUserUrl } from "../api/calls/userCalls";
import { IUser } from "../api/entities/UserEntity";
import { IEdition } from "../api/entities/EditionEntity";
import { extractIdFromEditionUrl } from "../api/calls/editionCalls";
import { ScopedMutator } from "swr/dist/types";
import { createProject, editProject } from "../api/calls/projectCalls";
import { createProjectSkill } from "../api/calls/projectSkillCalls";

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
 * All values contained directly in the Formik form of project creation/ edit.
 */
export interface ProjectFormSubmitValues {
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
}

/**
 * Takes care of the creation of a new project and the associated ProjectSkills
 * @param project the already existing project. Null if new project needs to be created.
 * @param values values needed to create a new project
 * @param router the next router object
 * @param editionUrl the current edition
 * @param ownUser the currently logged in user
 * @param mutate the global mutate function provided by SWR
 * @param apiURLTransformer function that transforms an url to an edition queried url.
 * @param removedCoaches list of [IUser] urls that are no longer coaches in the project.
 * @param removeProjectSkills list of projectSkills that are no longer needed.
 */
export async function ProjectFormSubmitHandler(
    project: IProject | null,
    values: ProjectCreationValues,
    removedCoaches: string[],
    removeProjectSkills: string[],
    editionUrl: string,
    ownUser: IUser,
    router: NextRouter,
    mutate: ScopedMutator<any>,
    apiURLTransformer: (url: string) => string
): Promise<boolean> {
    // Create new project
    const newProjectValues: Project = new Project(
        values.name,
        values.info,
        values.versionManagement,
        values.goals,
        values.partnerName,
        values.partnerWebsite,
        editionUrl,
        ownUser._links.self.href
    );
    let newProject: IProject | undefined;
    if (project) {
        newProject = await editProject(project._links.self.href, newProjectValues);
    } else {
        newProject = await createProject(newProjectValues);
    }
    if (!newProject) {
        return false;
    }
    const projectURI: string = newProject._links.self.href;

    // Create new projectSkills linked to the project
    const projectSkills: ProjectSkill[] = [];
    for (let i: number = 0; i < values.skills.length; i++) {
        projectSkills.push(new ProjectSkill(values.skills[i], values.skillInfos[i], projectURI));
    }
    await Promise.all(projectSkills.map((projectSkill) => createProjectSkill(projectSkill)));

    // Delete the project Skills that need to be removed
    await Promise.all(removeProjectSkills.map((skill) => baseDelete(skill)));

    // Set the coaches
    await axios.put(newProject._links.coaches.href, values.coaches, ManyToManyAxiosConf);

    // await Promise.all(
    //     values.coaches.map(
    //         async (coach) => await axios.put(newProject._links.coaches.href, coach, ManyToManyAxiosConf)
    //     )
    // );

    Promise.all([
        mutate(apiPaths.projects),
        mutate(apiURLTransformer(apiPaths.projectsByEdition)),
        mutate(newProject._links.neededSkills),
        mutate(newProject._links.coaches),
    ]).catch(console.log);

    await router.push(
        "/" + applicationPaths.projects + "/" + extractIdFromApiEntityUrl(newProject._links.self.href)
    );

    return true;
}
