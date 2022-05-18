import apiPaths from "../../properties/apiPaths";
import { useSwrWithEdition } from "../../hooks/utilHooks";
import { getAllStudentsFromPage } from "../../api/calls/studentCalls";
import { sortStudentsByName } from "../../api/entities/StudentEntity";
import ConflictResolutionItem from "./conflictResolutionItem";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";

export default function ConflictResolutionList() {
    const { t } = useTranslation("common");
    const { data: receivedStudents, error: studentsError } = useSwrWithEdition(
        apiPaths.studentConflict,
        getAllStudentsFromPage,
        { refreshInterval: 1000 }
    );

    if (studentsError) {
        console.log(studentsError);
        return null;
    }

    const students = sortStudentsByName(receivedStudents || []);

    return (
        <div data-testid="conflicts">
            {students.map((student, index) => (
                <div key={student._links.self.href}>
                    {capitalize(t("conflict"))} #{index + 1}
                    <ConflictResolutionItem student={student} />
                </div>
            ))}
        </div>
    );
}
