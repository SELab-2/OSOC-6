import apiPaths from "../../properties/apiPaths";
import { useSwrForEntityListWithEdition } from "../../hooks/utilHooks";
import { getAllStudentsFromPage } from "../../api/calls/studentCalls";
import { sortStudentsByName } from "../../api/entities/StudentEntity";
import ConflictResolutionItem from "./conflictResolutionItem";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import styles from "../../styles/conflicts.module.css";
import useConflictStudents from "../../hooks/useConflictStudents";

/**
 * List of conflicts. This component will get all conflicting students and list them in a useful way.
 */
export default function ConflictResolutionList() {
    const { t } = useTranslation("common");
    const { data: receivedStudents, error: studentsError } = useConflictStudents();

    if (studentsError) {
        console.log(studentsError);
        return null;
    }

    const students = sortStudentsByName(receivedStudents || []);

    return (
        <div data-testid="conflicts">
            {students.map((student, index) => (
                <div className={styles.conflict_full_div} key={student._links.self.href}>
                    <h4>
                        {capitalize(t("conflict"))} #{index + 1}
                    </h4>
                    <ConflictResolutionItem student={student} />
                </div>
            ))}
        </div>
    );
}
