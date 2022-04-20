import { getAllEntitiesFromLinksUrl, getAllEntitiesFromPage, getEntityOnUrl } from "./baseCalls";
import { IStudent, studentCollectionName } from "../entities/StudentEntity";
import { IProject } from "../entities/ProjectEntity";

/**
 * Fetches all students on a given StudentLinksUrl
 */
export function getAllStudentsFormLinks(url: string): Promise<IStudent[]> {
    return <Promise<IStudent[]>>getAllEntitiesFromLinksUrl(url, studentCollectionName);
}

export function getStudentOnUrl(url: string): Promise<IStudent> {
    return <Promise<IStudent>>getEntityOnUrl(url);
}
