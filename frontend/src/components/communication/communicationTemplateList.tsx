import { ICommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import Link from "next/link";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromCommunicationTemplateUrl } from "../../api/calls/communicationTemplateCalls";

export interface CommunicationTemplatesListProps {
    templates: ICommunicationTemplate[];
}

export default function CommunicationTemplatesList({ templates }: CommunicationTemplatesListProps) {
    return (
        <ul data-testid="communication-template-list">
            {templates.map((template) => (
                <li key={template._links.self.href}>
                    <Link
                        href={
                            "/" +
                            applicationPaths.communicationTemplateBase +
                            "/" +
                            extractIdFromCommunicationTemplateUrl(template._links.self.href)
                        }
                    >
                        {template.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}