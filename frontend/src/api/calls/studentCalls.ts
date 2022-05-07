import { getAllEntitiesFromPage, getEntityOnUrl, getQueryUrlFromParams } from "./baseCalls";
import {
    IStudent,
    OsocExpericience,
    studentCollectionName,
} from "../entities/StudentEntity";
import { IFullSuggestion, ISuggestion } from "../entities/SuggestionEntity";
import { getAllSuggestionsFromLinks, getFullSuggestionFromSuggestion } from "./suggestionCalls";
import { getSkillTypeByName } from "./skillTypeCalls";
import { ISkillType, SkillType } from "../entities/SkillTypeEntity";

export interface IStudentQueryParams {
    freeText: string;
    roles: string;
    studentCoach: boolean;
    alumni: boolean;
    unmatched: boolean;
}

export type IAllStudentInfo = {
    student: IStudent;
    suggestions: IFullSuggestion[];
    skills: ISkillType[];
};

/**
 * Fetches all students on a given StudentLinksUrl
 */
export function getAllStudentsFromPage(url: string): Promise<IStudent[]> {
    return <Promise<IStudent[]>>getAllEntitiesFromPage(url, studentCollectionName);
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

export async function getAllStudentInfo(studentUrl: string): Promise<IAllStudentInfo> {
    const student: IStudent = await getStudentOnUrl(studentUrl);
    const suggestions: ISuggestion[] = await getAllSuggestionsFromLinks(student._links.suggestions.href);
    const fullSuggestions: IFullSuggestion[] = await Promise.all(
        suggestions.map((suggestion: ISuggestion) => getFullSuggestionFromSuggestion(suggestion))
    );
    let skills: ISkillType[] = [];
    for (let item of student.skills) {
        const skill = await getSkillTypeByName(item);
        skills.push(skill);
    }

    return { student: student, suggestions: fullSuggestions, skills: skills };
}
