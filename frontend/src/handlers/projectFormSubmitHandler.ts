import apiPaths from "../properties/apiPaths";
import { NextRouter } from "next/router";
import axios from "axios";
import { baseDelete, extractIdFromApiEntityUrl, ManyToManyAxiosConf } from "../api/calls/baseCalls";
import { IProject, Project } from "../api/entities/ProjectEntity";
import applicationPaths from "../properties/applicationPaths";
import { ProjectSkill } from "../api/entities/ProjectSkillEntity";
import { IUser } from "../api/entities/UserEntity";
import { ScopedMutator } from "swr/dist/types";
import { createProject, editProject, setProjectCoaches } from "../api/calls/projectCalls";
import { createProjectSkill, editProjectSkill } from "../api/calls/projectSkillCalls";
import { RouterAction } from "../hooks/routerHooks";

/**
 * All values that a project need to contain.
 */
export interface ProjectCreationValues {
    name: string;
    info: string;
    versionManagement: string;
    partnerName: string;
    partnerWebsite: string;
    goals: string[];
    // List of ADDED skills. (excluding existing skills)
    addedSkills: string[];
    addedSkillsInfo: string[];
    // All coaches, new, and old.
    coaches: string[];
}

/**
 * Takes care of the creation of a new project and the associated ProjectSkills
 * @param project the already existing project. Null if new project needs to be created.
 * @param values values needed to create a new project
 * @param removeProjectSkills list of projectSkills that are no longer needed.
 * @param alteredSkills list of altered projectSkills.
 * @param routerAction the reroute action that needs to be taken after submission
 * @param editionUrl the current edition
 * @param ownUser the currently logged in user
 * @param mutate the global mutate function provided by SWR
 * @param apiURLTransformer function that transforms an url to an edition queried url.
 */
export async function projectFormSubmitHandler(
    project: IProject | null,
    values: ProjectCreationValues,
    removeProjectSkills: string[],
    alteredSkills: [string, ProjectSkill][],
    editionUrl: string,
    ownUser: IUser,
    routerAction: RouterAction,
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
    for (let i: number = 0; i < values.addedSkills.length; i++) {
        projectSkills.push(new ProjectSkill(values.addedSkills[i], values.addedSkillsInfo[i], projectURI));
    }
    const newCreatedSkills = await Promise.all(
        projectSkills.map((projectSkill) => createProjectSkill(projectSkill))
    );

    // alter existing project Skills
    const newAlteredSkills = await Promise.all(
        alteredSkills.map(([url, projectSkill]) => editProjectSkill(url, projectSkill))
    );

    // Delete the project Skills that need to be removed
    await Promise.all(removeProjectSkills.map((skill) => baseDelete(skill)));

    // Set the coaches
    await setProjectCoaches(newProject, values.coaches);

    Promise.all([
        mutate(apiPaths.projects),
        mutate(apiURLTransformer(apiPaths.projectsByEdition)),
        mutate(newProject._links.self.href, newProject),
        mutate(newProject._links.neededSkills),
        mutate(newProject._links.coaches),
    ]).catch(console.log);

    await routerAction(
        "/" + applicationPaths.projects + "/" + extractIdFromApiEntityUrl(newProject._links.self.href)
    );

    return true;
}
