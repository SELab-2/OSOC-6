import apiPaths from "../../properties/apiPaths";
import { useSwrWithEdition } from "../../hooks/utilHooks";
import { getAllStudentsFromPage } from "../../api/calls/studentCalls";
import { sortStudentsByName } from "../../api/entities/StudentEntity";
import ConflictResolutionItem from "./conflictResolutionItem";

export default function ConflictResolutionList() {
    const { data: receivedStudents, error: studentsError } = useSwrWithEdition(
        apiPaths.studentConflict,
        getAllStudentsFromPage
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
                    Conflict #{index}
                    <ConflictResolutionItem student={student} />
                </div>
            ))}
        </div>
    );
}
