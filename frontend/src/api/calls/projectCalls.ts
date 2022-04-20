import { IProject, projectCollectionName } from "../entities/ProjectEntity";
import { getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import { IUser } from "../entities/UserEntity";
import { getAllProjectSkillsFromLinks, IFullProjectSkill } from "./projectSkillCalls";
import { getAllUsersFromLinks } from "./userCalls";
import { IProjectSkill } from "../entities/ProjectSkillEntity";
import { ISkillType } from "../entities/SkillTypeEntity";
import { getSkillTypeFromSkill } from "./skillTypeCalls";
import { IStudent } from "../entities/StudentEntity";
import { IAssignment } from "../entities/AssignmentEntity";
import { getAllAssignmentsFormLinks } from "./AssignmentCalls";
import { getStudentOnUrl } from "./studentCalls";

/**
 * Fetches all projects on a given ProjectLinksUrl
 */
export function getAllProjectsFormPage(url: string): Promise<IProject[]> {
    return <Promise<IProject[]>>getAllEntitiesFromPage(url, projectCollectionName);
}

export function getProjectOnUrl(url: string): Promise<IProject> {
    return <Promise<IProject>>getEntityOnUrl(url);
}

export interface IFullProjectInfo {
    info: IProject;
    coaches: IUser[];
    skills: IFullProjectSkill[];
}

export async function getFullProjectInfo(projectUrl: string): Promise<IFullProjectInfo> {
    const project: IProject = await getProjectOnUrl(projectUrl);
    const coaches: IUser[] = await getAllUsersFromLinks(project._links.coaches.href);
    const neededSkills: IProjectSkill[] = await getAllProjectSkillsFromLinks(
        project._links.neededSkills.href
    );
    const skillTypes: ISkillType[] = await Promise.all(
        neededSkills.map((skill) => getSkillTypeFromSkill(skill))
    );
    const assignees: IStudent[][] = await Promise.all(
        neededSkills.map(async (skill) => {
            const assignments: IAssignment[] = await getAllAssignmentsFormLinks(
                skill._links.assignments.href
            );
            // No cache fetch is needed here since we expect the same user to appear only a few times.
            return Promise.all(
                assignments.map((assignment) => getStudentOnUrl(assignment._links.student.href))
            );
        })
    );
    const skills: IFullProjectSkill[] = neededSkills.map((skill, index) => ({
        skill,
        assignees: assignees[index],
        type: skillTypes[index],
    }));
    return { info: project, coaches, skills };
}
