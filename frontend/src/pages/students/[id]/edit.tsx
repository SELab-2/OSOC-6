import useTranslation from "next-translate/useTranslation";
import CreateStudentForm from "../../../components/student/createStudentForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";
import { emptyStudent, IStudent } from "../../../api/entities/StudentEntity";
import NavBar from "../../../components/util/navBar";
import { capitalize } from "../../../utility/stringUtil";

/**
 * Component allowing editing of a student.
 */
export default function StudentEdit() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id: string };
    const studentId = query.id;
    const { data: receivedStudent, error: studentError } = useSWR(
        apiPaths.students + "/" + studentId,
        getStudentOnUrl
    );

    if (studentError) {
        console.log(studentError);
        return null;
    }

    const student: IStudent = receivedStudent || emptyStudent;
    return (
        <>
            <NavBar />
            <div data-testid="student-edit">
                <CreateStudentForm student={student} title={capitalize(t("edit student"))} />
            </div>
        </>
    );
}
