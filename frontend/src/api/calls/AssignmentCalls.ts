import {
    baseDelete,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromLinksUrl,
    getEntityOnUrl,
} from "./baseCalls";
import { Assignment, assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";
import { IUser } from "../entities/UserEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Fetches all assignments on a given AssignmentLinksUrl
 */
export function getAllAssignmentsFormLinks(url: string): Promise<IAssignment[]> {
    return <Promise<IAssignment[]>>getAllEntitiesFromLinksUrl(url, assignmentCollectionName);
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
): Promise<void> {
    const assignment: Assignment = new Assignment(
        true,
        reason,
        currentUser._links.self.href,
        studentUrl,
        skillUrl
    );
    await basePost(apiPaths.assignments, assignment);
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

export async function invalidateAssignment(assignmentUrl: string): Promise<IAssignment | undefined> {
    const response = await basePatch(assignmentUrl, { isValid: false });
    const assignment = <IAssignment>response.data;
    try {
        // Check if response is a valid assignment.
        assignment._links.self.href;
        return assignment;
    } catch (e) {
        return undefined;
    }
}

/**
 * Extracts the id of a [IAssignment] from a URL hosting a single [IAssignment].
 * @param url hosting the [IAssignment].
 */
export function extractIdFromAssignmentUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
