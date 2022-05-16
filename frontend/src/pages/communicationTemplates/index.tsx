import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getAllCommunicationTemplatesFromPage } from "../../api/calls/communicationTemplateCalls";
import { ICommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import CommunicationTemplatesList from "../../components/communication/communicationTemplateList";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";

export default function CommunicationTemplateIndexPage() {
    const { data: receivedTemplates, error: templatesError } = useSWR(
        getQueryUrlFromParams(apiPaths.communicationTemplates, { sort: "name" }),
        getAllCommunicationTemplatesFromPage
    );

    if (templatesError) {
        console.log(templatesError);
        return null;
    }

    const templates: ICommunicationTemplate[] = receivedTemplates || [];

    return <CommunicationTemplatesList templates={templates} />;
}
