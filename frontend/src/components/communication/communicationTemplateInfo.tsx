import useTranslation from "next-translate/useTranslation";
import { Button } from "react-bootstrap";
import mailTo from "../../utility/mailTo";
import { capitalize } from "../../utility/stringUtil";
import {CommunicationTemplateEntity, ICommunicationTemplate} from "../../api/entities/CommunicationTemplateEntity";
import { IStudent } from "../../api/entities/StudentEntity";
import Link from "next/link";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import applicationPaths from "../../properties/applicationPaths";
import { extractIdFromCommunicationTemplateUrl } from "../../api/calls/communicationTemplateCalls";
import {useRouter} from "next/router";
import {useSWRConfig} from "swr";
import {createCommunicationTemplateSubmitHandler} from "../../handlers/createCommunicationTemplateSubmitHandler";
import {Field, Form, Formik} from "formik";

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
    const router = useRouter();
    const initialValues: CommunicationTemplateEntity = template
        ? new CommunicationTemplateEntity(template.name, template.subject, template.template)
        : new CommunicationTemplateEntity("", "", "");
    const { mutate } = useSWRConfig();

    return (
        <div data-testid="communication-template-info">
            <h2>Communication</h2>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    const editedTemplate: ICommunicationTemplate = await createCommunicationTemplateSubmitHandler(
                        template ? template._links.self.href : null,
                        values,
                        router,
                        mutate
                    )

                    // document.location.href = mailTo({
                    //     body: editedTemplate.template,
                    //     subject: editedTemplate.subject,
                    //     recipients: student ? [student.email] : undefined
                    // });
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <div className="text-wrap">{capitalize(t("for")) + ": " + student?.email}</div>

                    </Form>
                )}
            </Formik>
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
        </div>
    );
}
