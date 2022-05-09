import {
    AxiosConf,
    baseDelete,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromLinksUrl,
} from "./baseCalls";
import { Assignment, assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";
import axios from "axios";
import { IStudent } from "../entities/StudentEntity";
import { IUser } from "../entities/UserEntity";
import apiPaths from "../../properties/apiPaths";

/**
 * Fetches all assignments on a given AssignmentLinksUrl
 */
export function getAllAssignmentsFormLinks(url: string): Promise<IAssignment[]> {
    return <Promise<IAssignment[]>>getAllEntitiesFromLinksUrl(url, assignmentCollectionName);
}

/**
 * Adds one assignment with the current user as the assigner, validity is true and suggestion is false.
 * @param studentUrl The url of the student you want to assign
 * @param skillUrl The url of the skill you want to assign to the student
 * @param reason The reason for the assignment
 */
export async function addAssignment(
    studentUrl: string,
    skillUrl: string,
    reason: string,
    ownUser: IUser
): Promise<void> {
    const assignment: Assignment = new Assignment(
        false,
        true,
        reason,
        ownUser._links.self.href,
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

export function extractIdFromAssignmentUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
