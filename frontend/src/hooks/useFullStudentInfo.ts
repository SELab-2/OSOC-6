import useSWR from "swr";
import { getStudentOnUrl } from "../api/calls/studentCalls";
import { getFullSuggestionsFromPage, IFullSuggestion } from "../api/calls/suggestionCalls";
import { IStudent } from "../api/entities/StudentEntity";

/**
 * Interface defining the shape of student info and extra entities needed to make a student whole.
 */
export type IFullStudentInfo = {
    student?: IStudent;
    suggestions?: IFullSuggestion[];
};

/**
 * Hook providing you with the [IFullStudentInfo] on a certain url. Uses SWR to handle these calls.
 * @param url the url where the student entity is served on.
 */
export default function useFullStudentInfo(url: string): { data?: IFullStudentInfo; error?: Error } {
    const { data: student, error: studentError } = useSWR(url, getStudentOnUrl);
    const { data: suggestions, error: suggestionError } = useSWR(
        student ? student._links.suggestions.href : null,
        getFullSuggestionsFromPage
    );

    if (studentError || suggestionError) {
        return { error: studentError || suggestionError };
    }

    return {
        data: {
            student,
            suggestions,
        },
    };
}
