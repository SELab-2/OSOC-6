import useTranslation from "next-translate/useTranslation";
import CreateCommunicationTemplateForm from "../../../components/communication/createCommunicationTemplateForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import apiPaths from "../../../properties/apiPaths";
import { getCommunicationTemplateOnUrl } from "../../../api/calls/communicationTemplateCalls";
import {
    emptyCommunicationTemplate,
    ICommunicationTemplate,
} from "../../../api/entities/CommunicationTemplateEntity";
import { capitalize } from "../../../utility/stringUtil";

export default function CommunicationTemplateEditPage() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const query = router.query as { id: string };
    const templateId = query.id;
    const { data: receivedTemplate, error: templateError } = useSWR(
        apiPaths.communicationTemplates + "/" + templateId,
        getCommunicationTemplateOnUrl
    );

    if (templateError) {
        console.log(templateError);
        return null;
    }

    const template: ICommunicationTemplate = receivedTemplate || emptyCommunicationTemplate;

    return (
        <div data-testid="communication-template-edit">
            <h1>
                {capitalize(t("edit communicationTemplate")) + ": " + template.name}
            </h1>
            <CreateCommunicationTemplateForm template={template} />
        </div>
    );
}
