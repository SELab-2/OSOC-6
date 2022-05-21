import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import { emptyCommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import CommunicationTemplateInfo from "../../components/communication/communicationTemplateInfo";

/**
 * Page that renders the information of a communication template.
 */
export default function CommunicationTemplatePage() {
    const router = useRouter();
    const query = router.query as { id: string };
    const templateId = query.id;

    const { data, error } = useSWR(
        apiPaths.communicationTemplates + "/" + templateId,
        getCommunicationTemplateOnUrl
    );
    if (error) {
        console.log(error);
        return null;
    }

    const template = data || emptyCommunicationTemplate;

    return <CommunicationTemplateInfo template={template} />;
}
