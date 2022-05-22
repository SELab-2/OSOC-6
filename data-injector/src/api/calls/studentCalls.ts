import {
    baseDelete,
    basePatch,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { IStudent, OsocExperience, Status, studentCollectionName } from "../entities/StudentEntity";
import { AxiosResponse } from "axios";

export interface IStudentQueryParams {
    freeText: string;
    skills: string[];
    studentCoach: boolean;
    alumni: boolean;
    unmatched: boolean;
    status: string;
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
        experience.push(OsocExperience.yes_studentCoach);
    }
    if (params.alumni) {
        experience.push(OsocExperience.yes_studentCoach, OsocExperience.yes_noStudentCoach);
    }

    const queryParams: { [k: string]: any } = {};
    if (params.skills.length !== 0) {
        queryParams.skills = params.skills.join(" ");
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
    if (params.status) {
        queryParams.status = params.status;
    }

    return getQueryUrlFromParams(url, queryParams);
}

/**
 * Extracts the id of a [IStudent] from a URL hosting a single [IStudent].
 * @param url hosting the [IStudent].
 */
export function extractIdFromStudentUrl(url: string): string {
    return extractIdFromApiEntityUrl(url);
}

/**
 * Removes a student from the database
 * @param url hosting the [IStudent]
 */
export async function deleteStudent(url: string): Promise<AxiosResponse> {
    return await baseDelete(url);
}
