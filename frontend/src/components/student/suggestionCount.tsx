import useSWR from "swr";
import { getStudentOnUrl } from "../../api/calls/studentCalls";
import styles from "../../styles/studentList.module.css";
import { emptyStudent } from "../../api/entities/StudentEntity";

export function SuggestionCount(props: { studentUrl: string }) {
    const { data: receivedStudent, error: studentError } = useSWR(props.studentUrl, getStudentOnUrl);

    if (studentError) {
        console.log(studentError);
        return null;
    }

    const student = receivedStudent || emptyStudent;

    const total = student.yesSuggestionCount + student.maybeSuggestionCount + student.noSuggestionCount;
    const yes = (student.yesSuggestionCount / total) * 100;
    const maybe = (student.maybeSuggestionCount / total) * 100;

    if (student.yesSuggestionCount + student.maybeSuggestionCount + student.noSuggestionCount != 0) {
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
