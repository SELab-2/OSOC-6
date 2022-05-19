import { ICommunication } from "../../api/entities/CommunicationEntity";
import useSWR from "swr";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";
import useTranslation from "next-translate/useTranslation";

/**
 * Properties of [CommunicationListItem].
 */
export interface CommunicationListItemProps {
    communication: ICommunication;
}

/**
 * An item in the [CommunicationList].
 * Renders the details of a single [ICommunication] entity as a list item.
 * @param communication the specified [ICommunication] item.
 */
export default function CommunicationListItem({ communication }: CommunicationListItemProps) {
    const { t } = useTranslation("common");
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
            <div>{date.toLocaleString() + " " + t("by medium") + " " + communication.medium}</div>
        </li>
    );
}
