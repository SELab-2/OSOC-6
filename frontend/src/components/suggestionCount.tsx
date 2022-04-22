import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import { getFullProjectInfo } from "../api/calls/projectCalls";
import { getStudentOnUrl } from "../api/calls/studentCalls";

export function SuggestionCount(props: { studentUrl: string }) {
    const { t } = useTranslation("common");
    const { data, error } = useSWR(props.studentUrl, getStudentOnUrl);

    if (error || !data) {
        return null;
    }

    return (
        <>
            yes: {data.yesSuggestionCount} maybe: {data.maybeSuggestionCount} no: {data.noSuggestionCount}
        </>
    );
}
