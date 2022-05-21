import { ICommunication } from "../../api/entities/CommunicationEntity";
import useSWR from "swr";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";
import useTranslation from "next-translate/useTranslation";
import AccordionHeader from "react-bootstrap/AccordionHeader";
import AccordionBody from "react-bootstrap/AccordionBody";
import AccordionItem from "react-bootstrap/AccordionItem";

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
 * @param index the index of the accordionItem
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
        <AccordionItem key={communication._links.self.href} eventKey={`${communication._links.self.href}`} data-testid="communication">
            <AccordionHeader className={"bg-secondary"}>
                <div>
                    <h4>{template.name}</h4>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <h6>{template.subject}</h6>
                        <p style={{ paddingLeft: 5 }}>
                            - {date.toLocaleString() + " " + t("by medium") + " " + communication.medium}
                        </p>
                    </div>
                </div>
            </AccordionHeader>
            <AccordionBody>
                <div style={{ color: "black" }}>{communication.content}</div>
            </AccordionBody>
        </AccordionItem>
    );
}
