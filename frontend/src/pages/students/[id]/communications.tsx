import CommunicationList from "../../../components/communication/communicationList";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getStudentOnUrl } from "../../../api/calls/studentCalls";

export default function CommunicationPage() {
    const router = useRouter();
    const query = router.query as { id: string };

    const { data: receivedStudent, error: studentError } = useSWR(
        apiPaths.students + "/" + query.id,
        getStudentOnUrl
    );

    if (studentError) {
        console.log(studentError);
        return null;
    }

    return <CommunicationList student={receivedStudent} />;
}
