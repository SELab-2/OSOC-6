import { useRouter } from "next/router";
import useSWR from "swr";
import { emptyStudent, IStudent } from "../../../api/entities/StudentEntity";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";
import apiPaths from "../../../properties/apiPaths";
import CreateCommunicationForm from "../../../components/communication/createCommunicationForm";
import { capitalize } from "../../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";

/**
 * Page that allows you to register a new communication with the given student.
 */
export default function CommunicationInfoPage() {
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
            <h1>{capitalize(t("register communication for")) + " " + student.callName}</h1>
            <CreateCommunicationForm student={student} />
        </>
    );
}
