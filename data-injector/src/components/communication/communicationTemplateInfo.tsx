import useTranslation from "next-translate/useTranslation";
import { Button } from "react-bootstrap";
import mailTo from "../../utility/mailTo";
import { capitalize } from "../../utility/stringUtil";
import { ICommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import { IStudent } from "../../api/entities/StudentEntity";
import Link from "next/link";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromCommunicationTemplateUrl } from "../../api/calls/communicationTemplateCalls";

/**
 * The parameters you can provide to [CommunicationTemplateInfo].
 */
export interface ICommunicationTemplateInfoParams {
    template: ICommunicationTemplate;
    student?: IStudent;
}

/**
 * Component that renders the information of a communication template.
 */
export default function CommunicationTemplateInfo({ template, student }: ICommunicationTemplateInfoParams) {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();

    return (
        <div data-testid="communication-template-info">
            <h1 className="capitalize">{t("communication template") + ": " + template.name}</h1>
            <Button
                data-testid="mail-to-button"
                href={mailTo({
                    body: template.template,
                    subject: template.subject,
                    recipients: student ? [student.email] : undefined,
                })}
            >
                {capitalize(t("open in mail application"))}
            </Button>
            <div className="text-wrap">{t("subject") + ": " + template.subject}</div>
            <hr />
            <div className="text-wrap">{template.template}</div>
            <Link
                href={transformer(
                    "/" +
                        applicationPaths.communicationTemplateBase +
                        "/" +
                        extractIdFromCommunicationTemplateUrl(template._links.self.href) +
                        "/" +
                        applicationPaths.communicationTemplateEdit.split(
                            applicationPaths.communicationTemplateInfo
                        )[1]
                )}
            >
                edit
            </Link>
        </div>
    );
}
