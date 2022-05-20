import { IStudent } from "../../api/entities/StudentEntity";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import { extractIdFromStudentUrl } from "../../api/calls/studentCalls";
import { ICommunication } from "../../api/entities/CommunicationEntity";
import { getAllCommunicationFromPage } from "../../api/calls/communicationCalls";
import CommunicationListItem from "./communicationListItem";

/**
 * Properties needed for [CommunicationList].
 */
export interface CommunicationListProps {
    student: IStudent | undefined;
}

/**
 * Component listing all communication with a given student. 
 * @param student [IStudent] the communication that needs to be listed.
 */
export default function CommunicationList({ student }: CommunicationListProps) {
    const { data: receivedCommunications, error: communicationsError } = useSWR(
        student
            ? getQueryUrlFromParams(apiPaths.communicationsByStudent, {
                  studentId: extractIdFromStudentUrl(student._links.self.href),
                  sort: "timestamp",
              })
            : null,
        getAllCommunicationFromPage
    );

    if (communicationsError) {
        console.log(communicationsError);
        return null;
    }

    const communications: ICommunication[] = receivedCommunications || [];

    return (
        <div data-testid="communication-list">
            <ul>
                {communications.map((communication) => (
                    <CommunicationListItem
                        communication={communication}
                        key={communication._links.self.href}
                    />
                ))}
            </ul>
        </div>
    );
}
