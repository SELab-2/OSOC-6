import { getAllEntitiesFromLinksUrl } from "./baseCalls";
import { assignmentCollectionName, IAssignment } from "../entities/AssignmentEntity";

/**
 * Fetches all assignments on a given AssignmentLinksUrl
 */
export function getAllAssignmentsFormLinks(url: string): Promise<IAssignment[]> {
    return <Promise<IAssignment[]>>getAllEntitiesFromLinksUrl(url, assignmentCollectionName);
}
