import {
    basePatch,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { IStudent, OsocExpericience, Status, studentCollectionName } from "../entities/StudentEntity";

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

export async function patchStudentStatus(url: string, status: Status) {
    await basePatch(url, { status: status });
}

export function getStudentOnUrl(url: string): Promise<IStudent> {
    return <Promise<IStudent>>getEntityOnUrl(url);
}

export function constructStudentQueryUrl(url: string, params: IStudentQueryParams): string {
    const experience: string[] = [];
    if (params.studentCoach) {
        experience.push(OsocExpericience.yes_studentCoach);
    }
    if (params.alumni) {
        experience.push(OsocExpericience.yes_studentCoach, OsocExpericience.yes_noStudentCoach);
    }

    const queryParams: { [k: string]: any } = {};
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

export function extractIdFromStudentUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}
