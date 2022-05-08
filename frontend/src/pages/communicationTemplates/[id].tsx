import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import { Button } from "react-bootstrap";
import mailTo from "../../utility/mailTo";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import CommunicationTemplateInfo from "../../components/CommunicationTemplateInfo";

/**
 * Component that renders the information of a communication template.
 */
export default function CommunicationTemplatePage() {
    const router = useRouter();
    const query = router.query as { id: string };
    const templateId = query.id;

    return <CommunicationTemplateInfo url={apiPaths.communicationTemplates + "/" + templateId} />;
}
