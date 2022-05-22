import {
    baseDelete,
    basePatch,
    basePost,
    extractIdFromApiEntityUrl,
    getAllEntitiesFromPage,
    getEntityOnUrl,
    getQueryUrlFromParams,
} from "./baseCalls";
import { IStudent, OsocExperience, Status, Student, studentCollectionName } from "../entities/StudentEntity";
import apiPaths from "../../properties/apiPaths";
import { AxiosResponse } from "axios";
import { baseSkillType } from "../entities/SkillTypeEntity";

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

/**
 * Should not query when other is set. Other is a frontend filter (for now).
 * @param url the url that needs to be transformed
 * @param params the params that are used to query the student.
 */
export function constructStudentQueryUrl(url: string, params: IStudentQueryParams): string {
    const experience: string[] = [];
    if (params.studentCoach) {
        experience.push(OsocExperience.yes_studentCoach);
    }
    if (params.alumni) {
        experience.push(OsocExperience.yes_studentCoach, OsocExperience.yes_noStudentCoach);
    }

    const queryParams: { [k: string]: any } = {};
    const queriedSkillList = params.skills.filter(
        (skill) => skill.toUpperCase() !== baseSkillType.toUpperCase()
    );
    if (queriedSkillList.length !== 0) {
        queryParams.skills = queriedSkillList.join(" ");
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
 * Function posting creating a new student on the backend.
 * @param student the student that needs to be created.
 */
export async function createNewStudent(student: Student): Promise<IStudent> {
    return <Promise<IStudent>>(await basePost(apiPaths.students, student)).data;
}

/**
 * Function patching an updated student on the backend.
 * @param url the url to patch to
 * @param student the student that needs to be updated.
 */
export async function editStudent(url: string, student: Student): Promise<IStudent> {
    return <Promise<IStudent>>(await basePatch(url, student)).data;
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
