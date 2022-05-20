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

export interface CommunicationListItemProps {
    communication: ICommunication;
    index: number;
}

export default function CommunicationListItem({ communication, index }: CommunicationListItemProps) {
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
        <AccordionItem key={index} eventKey={`${index}`} data-testid="communication">
            <AccordionHeader className={"bg-secondary"}>
                <div>
                    <h4>{template.name}</h4>
                    <p>{date.toLocaleString() + " " + t("by medium") + " " + communication.medium}</p>
                </div>
            </AccordionHeader>
        <AccordionBody>
            <div style={{color: "black"}}>
                {communication.content}
            </div>
        </AccordionBody>
        </AccordionItem>
    );
}
