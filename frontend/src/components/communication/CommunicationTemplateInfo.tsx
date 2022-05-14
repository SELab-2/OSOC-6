import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import { getCommunicationTemplateOnUrl } from "../../api/calls/communicationTemplateCalls";
import { Button } from "react-bootstrap";
import mailTo from "../../utility/mailTo";
import { capitalize } from "../../utility/stringUtil";

/**
 * The parameters you can provide to [CommunicationTemplateInfo].
 */
export interface ICommunicationTemplateInfoParams {
    url: string;
}

/**
 * Component that renders the information of a communication template.
 */
export default function CommunicationTemplateInfo({ url }: ICommunicationTemplateInfoParams) {
    const { t } = useTranslation("common");

    const { data, error } = useSWR(url, getCommunicationTemplateOnUrl);
    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div data-testid="communication-template-info">
            <h1 className="capitalize">{t("communication template") + ": " + data?.name}</h1>
            <Button
                data-testid="mail-to-button"
                href={mailTo({
                    body: data?.template,
                    subject: data?.subject,
                })}
            >
                {capitalize(t("open in mail application"))}
            </Button>
            <div className="text-wrap">{t("subject") + ": " + data?.subject}</div>
            <hr />
            <div className="text-wrap">{data?.template}</div>
        </div>
    );
}
