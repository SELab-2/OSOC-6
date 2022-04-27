import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import { getStudentOnUrl } from "../api/calls/studentCalls";
import styles from "../styles/studentList.module.css";

export function SuggestionCount(props: { studentUrl: string }) {
    const { data, error } = useSWR(props.studentUrl, getStudentOnUrl);

    if (error || !data) {
        return null;
    }

    const total = data.yesSuggestionCount + data.maybeSuggestionCount + data.noSuggestionCount;
    const yes = (data.yesSuggestionCount / total) * 100;
    const maybe = (data.maybeSuggestionCount / total) * 100;

    if (data.yesSuggestionCount + data.maybeSuggestionCount + data.noSuggestionCount != 0) {
        return (
            <div
                className={styles.line}
                data-testid="suggestioncount"
                style={{
                    background: `linear-gradient(to right, #1DE1AE ${yes}%, 
                                    #FCB70F ${yes}% ${yes + maybe}%, #F14A3B ${yes + maybe}% 100%)`,
                }}
            />
        );
    } else {
        return (
            <div
                className={styles.line}
                data-testid="nosuggestions"
                style={{
                    background: "gray",
                }}
            />
        );
    }
}
