import useSWR from "swr";
import { getStudentOnUrl } from "../api/calls/studentCalls";
import { getFullSuggestionsFromPage, IFullSuggestion } from "../api/calls/suggestionCalls";
import { IStudent } from "../api/entities/StudentEntity";

export type IFullStudentInfo = {
    student?: IStudent;
    suggestions?: IFullSuggestion[];
};

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
