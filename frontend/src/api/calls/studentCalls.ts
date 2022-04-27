import { getAllEntitiesFromPage, getEntityOnUrl, getQueryUrlFromParams } from "./baseCalls";
import { IStudent, OsocExpericience, studentCollectionName } from "../entities/StudentEntity";

export interface IStudentQueryParams {
    freeText: string;
    roles: string;
    studentCoach: boolean;
    alumni: boolean;
    unmatched: boolean;
}

/**
 * Fetches all students on a given StudentLinksUrl
 */
export function getAllStudentsFromPage(url: string): Promise<IStudent[]> {
    return <Promise<IStudent[]>>getAllEntitiesFromPage(url, studentCollectionName);
}

export function getStudentOnUrl(url: string): Promise<IStudent> {
    return <Promise<IStudent>>getEntityOnUrl(url);
}

export function baseUrlAndQueryParamsToUrl(
    url: string,
    params: IStudentQueryParams & { editionId: number }
): string {
    const experience: string[] = [];
    if (params.studentCoach) {
        experience.push(OsocExpericience.yes_studentCoach);
    }
    if (params.alumni) {
        experience.push(OsocExpericience.yes_studentCoach, OsocExpericience.yes_noStudentCoach);
    }

    const queryParams: { [k: string]: any } = {};
    queryParams.edition = params.editionId;
    if (params.roles) {
        queryParams.roles = params.roles;
    }
    if (params.freeText) {
        queryParams.freeText = params.freeText;
    }
    if (params.unmatched) {
        queryParams.unmatched = params.unmatched;
    }
    if (experience.length > 0) {
        queryParams.experience = experience;
    }

    return getQueryUrlFromParams(url, queryParams);
}
