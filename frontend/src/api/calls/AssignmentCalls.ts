import { AxiosConf, getAllEntitiesFromLinksUrl } from "./baseCalls";
import { assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";
import axios from "axios";
import { IStudent } from "../entities/StudentEntity";
import { IUser } from "../entities/UserEntity";

export type ProjectAssignments = { assignment: IAssignment; student: IStudent; assigner: IUser }[];

/**
 * Fetches all assignments on a given AssignmentLinksUrl
 */
export function getAllAssignmentsFormLinks(url: string): Promise<IAssignment[]> {
    return <Promise<IAssignment[]>>getAllEntitiesFromLinksUrl(url, assignmentCollectionName);
}

/**
 * Deletes one assignment and returns the array with the remaining assignments.
 * @param assignmentURL URL of the assignment to be deleted
 * @param oldAssignments List of the assignments for a project
 */
export async function deleteAssignment(
    assignmentURL: string,
    oldAssignments: ProjectAssignments
): Promise<ProjectAssignments> {
    await axios.delete(assignmentURL, AxiosConf);
    const assignments: ProjectAssignments = [];
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
export async function getAssignments(url: string): Promise<ProjectAssignments> {
    const assignmentList: IAssignment[] = await getAllAssignmentsFormLinks(url);
    let assignments: ProjectAssignments = [];
    const assigners: { [url: string]: IUser } = {};
    const students: { [url: string]: IStudent } = {};

    if (assignmentList == undefined) {
        return assignments;
    }

    for (let assignment of assignmentList) {
        if (assignment.isValid) {
            const studentURL = assignment._links.student.href;
            const assignerURL = assignment._links.assigner.href;

            let student: IStudent;
            if (students[studentURL] == undefined) {
                student = (await axios.get(studentURL, AxiosConf)).data;
                students[studentURL] = student;
            } else {
                student = students[studentURL];
            }

            let assigner: IUser;
            if (assigners[assignerURL] == undefined) {
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
function sortAssignments(assignments: ProjectAssignments) {
    assignments.sort((assignment1, assignment2) => {
        if (assignment1.student.firstName > assignment2.student.firstName) {
            return 1;
        }

        if (assignment1.student.firstName < assignment2.student.firstName) {
            return -1;
        }

        if (assignment1.assigner.username > assignment2.assigner.username) {
            return 1;
        }

        if (assignment1.assigner.username < assignment2.assigner.username) {
            return -1;
        }

        return 0;
    });
}
