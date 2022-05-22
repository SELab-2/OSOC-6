import {
    baseDelete,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { Assignment, assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";
import { IUser } from "../entities/UserEntity";
import apiPaths from "../../properties/apiPaths";
import { extractIdFromProjectUrl } from "./projectCalls";
import { IProjectSkill } from "../entities/ProjectSkillEntity";
import { IStudent } from "../entities/StudentEntity";

/**
 * Gets all [IAssignment] entities on an url hosting [IPage].
 * @param url url hosting the IPage
 */
export function getAllAssignmentsFromPage(url: string): Promise<IAssignment[]> {
    return <Promise<IAssignment[]>>getAllEntitiesFromPage(url, assignmentCollectionName);
}

/**
 * Function getting an [IAssignment] entity on the provided url.
 * @param url the url hosting the [IAssignment] entity.
 */
export function getAssignmentOnUrl(url: string): Promise<IAssignment> {
    return <Promise<IAssignment>>getEntityOnUrl(url);
}

/**
 * Adds one assignment with the provided user as the assigner, validity is true and suggestion is false.
 * @param studentUrl The url of the student you want to assign
 * @param skillUrl The url of the skill you want to assign to the student
 * @param reason The reason for the assignment
 * @param currentUser The user that executes the assignment. (Should be requested with [useCurrentUser])
 */
export async function addAssignment(
    studentUrl: string,
    skillUrl: string,
    reason: string,
    currentUser: IUser
): Promise<IAssignment | undefined> {
    const assignment: Assignment = new Assignment(
        true,
        reason,
        currentUser._links.self.href,
        studentUrl,
        skillUrl
    );
    const newAssignment: IAssignment | undefined = (await basePost(apiPaths.assignments, assignment)).data;
    return newAssignment?._links ? newAssignment : undefined;
}

/**
 * Deletes an assignment hosted on URL.
 */
export async function deleteAssignment(
    assignmentURL: string,
    oldAssignments: IAssignment[]
): Promise<IAssignment[]> {
    await baseDelete(assignmentURL);
    return oldAssignments.filter((assignment) => assignment._links.self.href !== assignmentURL);
}

/**
 * Function setting the assignment on a given url to invalid.
 * @param assignmentUrl the url of the [IAssignment] that needs to be invalid.
 */
export async function invalidateAssignment(assignmentUrl: string): Promise<IAssignment | undefined> {
    const response = await basePatch(assignmentUrl, { isValid: false });
    const assignment = <IAssignment>response.data;

    return "_links" in assignment ? assignment : undefined;
}

/**
 * Function providing you with the query url to get only the valid assignments surrounding a given [IProjectSkill].
 * @param projectSkillUrl the projectSkill url you want to get the assignments url for.
 */
export function getValidAssignmentsUrlForProjectSkill(projectSkillUrl: string): string {
    const projectSkillId = extractIdFromProjectUrl(projectSkillUrl);
    return getQueryUrlFromParams(apiPaths.assignmentsValidityByProjectSkill, { projectSkillId, valid: true });
}

/**
 * Function providing you with the query url to get only the valid assignments surrounding a given [IStudent].
 * @param studentUrl the url where the [IStudent] you want to get the assignments url for is hosted on.
 */
export function getValidAssignmentsUrlForStudent(studentUrl: string): string {
    const studentId = extractIdFromProjectUrl(studentUrl);
    return getQueryUrlFromParams(apiPaths.assignmentsValidityByStudent, { studentId, valid: true });
}

/**
 * Extracts the id of a [IAssignment] from a URL hosting a single [IAssignment].
 * @param url hosting the [IAssignment].
 */
export function extractIdFromAssignmentUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
