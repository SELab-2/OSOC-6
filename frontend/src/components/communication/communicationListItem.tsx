import { ICommunication } from "../../api/entities/CommunicationEntity";
import useSWR from "swr";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";

export interface CommunicationListItemProps {
    communication: ICommunication;
}

export default function CommunicationListItem({ communication }: CommunicationListItemProps) {
    const { data: receivedTemplate, error: templateError } = useSWR(
        communication._links.template.href,
        getCommunicationTemplateOnUrl
    );

    if (templateError) {
        console.log(templateError);
        return null;
    }

    const template: ICommunicationTemplate = receivedTemplate || emptyCommunicationTemplate;
    const date = new Date(communication.timestamp);

    return (
        <li>
            <div>{template.name}</div>
            <div>{date.toLocaleString() + " via " + communication.medium}</div>
        </li>
    );
}
