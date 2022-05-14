import useCompleteCommunicationOnUrl from "../../hooks/useCompleteCommunication";
import { emptyCommunication, ICommunication } from "../../api/entities/CommunicationEntity";
import { emptyStudent, IStudent } from "../../api/entities/StudentEntity";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";

/**
 * The parameters you can provide to [CommunicationInfo].
 */
export interface ICommunicationInfoParams {
    url: string;
}

/**
 * Component rendering the info about a communication
 * @param url where the communication is hosted on.
 */
export default function CommunicationInfo({ url }: ICommunicationInfoParams) {
    const { data, error } = useCompleteCommunicationOnUrl(url);

    const communication: ICommunication = data?.communication || emptyCommunication;

    const student: IStudent = data?.student || emptyStudent;

    const template: ICommunicationTemplate = data?.template || emptyCommunicationTemplate;

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
