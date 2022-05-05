import { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import useCompleteCommunicationOnUrl from "../../hooks/useCompleteCommunication";
import { emptyStudent, IStudent } from "../../api/entities/StudentEntity";
import { emptyCommunication, ICommunication } from "../../api/entities/CommunicationEntity";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";

export default function CommunicationInfo() {
    const router = useRouter();
    const query = router.query as { id: string };
    const communicationId = query.id;

    const { data, error } = useCompleteCommunicationOnUrl(apiPaths.communications + "/" + communicationId);

    const communication: ICommunication = data?.communication || emptyCommunication;

    const student: IStudent = data?.student || emptyStudent;

    const template: ICommunicationTemplate = data?.template || emptyCommunicationTemplate;

    console.log(communication);

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div data-testid="communication-info">
            <h1>{student.callName + ": " + template.name}</h1>
            {communication?.timestamp + " " + communication.medium}
            <div>{communication.content}</div>
        </div>
    );
}
