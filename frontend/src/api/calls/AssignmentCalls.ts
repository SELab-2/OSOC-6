import { AxiosConf, getAllEntitiesFromLinksUrl } from "./baseCalls";
import { Assignment, assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";
import axios from "axios";
import { IStudent } from "../entities/StudentEntity";
import { IUser } from "../entities/UserEntity";
import apiPaths from "../../properties/apiPaths";

export type IFullAssignment = { assignment: IAssignment; student: IStudent; assigner: IUser };

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
export async function addAssignment(studentUrl: string, skillUrl: string, reason: string) {
    const user: IUser = (await axios.get(apiPaths.ownUser, AxiosConf)).data;
    const assignment: Assignment = new Assignment(
        false,
        true,
        reason,
        user._links.self.href,
        studentUrl,
        skillUrl
    );
    await axios.post(apiPaths.base + apiPaths.assignments, assignment, AxiosConf);
}

/**
 * Deletes one assignment and returns the array with the remaining assignments.
 * @param assignmentURL URL of the assignment to be deleted
 * @param oldAssignments List of the assignments for a project
 */
export async function deleteFullAssignment(
    assignmentURL: string,
    oldAssignments: IFullAssignment[]
): Promise<IFullAssignment[]> {
    await axios.delete(assignmentURL, AxiosConf);
    const assignments: IFullAssignment[] = [];
    for (let assignment of oldAssignments) {
        if (assignment.assignment._links.assignment.href != assignmentURL) {
            assignments.push(assignment);
        }
    }
    return assignments;
}

/**
 * Gets the data needed to make an assignment item, this includes the student, assigner and assignment itself.
 * It returns a list of ProjectAssignments.
 * @param url The URL of the assignments for a project.
 */
export async function getFullAssignments(url: string): Promise<IFullAssignment[]> {
    const assignmentList: IAssignment[] = await getAllAssignmentsFormLinks(url);
    let assignments: IFullAssignment[] = [];
    const assigners: { [url: string]: IUser } = {};
    const students: { [url: string]: IStudent } = {};

    if (assignmentList === undefined) {
        return assignments;
    }

    for (let assignment of assignmentList) {
        if (assignment.isValid) {
            const studentURL = assignment._links.student.href;
            const assignerURL = assignment._links.assigner.href;

            let student: IStudent;
            if (students[studentURL] === undefined) {
                student = (await axios.get(studentURL, AxiosConf)).data;
                students[studentURL] = student;
            } else {
                student = students[studentURL];
            }

            let assigner: IUser;
            if (assigners[assignerURL] === undefined) {
                assigner = (await axios.get(assignerURL, AxiosConf)).data;
                assigners[assignerURL] = assigner;
            } else {
                assigner = assigners[assignerURL];
            }
            assignments.push({ assignment, student, assigner });
        }
    }

    sortAssignments(assignments);

    return assignments;
}

/**
 * Custom sort function for assignment items.
 * It sorts the assignments on the students first name,
 * if the students have the same name we sort on the username of the assigner.
 * @param assignments
 */
function sortAssignments(assignments: IFullAssignment[]) {
    assignments.sort((assignment1, assignment2) => {
        const compareStudents = assignment1.student.firstName.localeCompare(assignment2.student.firstName);
        if (compareStudents == 0) {
            return assignment1.assigner.callName.localeCompare(assignment2.assigner.callName);
        }
        return compareStudents;
    });
}
