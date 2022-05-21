import { Field, Form, Formik } from "formik";
import {
    CommunicationTemplateEntity,
    ICommunicationTemplate,
} from "../../api/entities/CommunicationTemplateEntity";
import { createCommunicationTemplateSubmitHandler } from "../../handlers/createCommunicationTemplateSubmitHandler";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { useSWRConfig } from "swr";

/**
 * Properties of the [CreateCommunicationTemplateForm] component.
 */
export interface CreateCommunicationTemplateFormProps {
    template?: ICommunicationTemplate;
}

/**
 * Form allowing the creation of a new communication template or editing an existing.
 * @param template the template that should be edited. [undefined] if the form is in creation mode.
 */
export default function CreateCommunicationTemplateForm({ template }: CreateCommunicationTemplateFormProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const initialValues: CommunicationTemplateEntity = template
        ? new CommunicationTemplateEntity(template.name, template.subject, template.template)
        : new CommunicationTemplateEntity("", "", "");
    const { mutate } = useSWRConfig();

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            onSubmit={(values) =>
                createCommunicationTemplateSubmitHandler(
                    template ? template._links.self.href : null,
                    values,
                    router,
                    mutate
                )
            }
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <div>
                        <label htmlFor="communicationTemplateNameField">{capitalize(t("name")) + ":"}</label>

                        {template && <label id="communicationTemplateNameField">{values.name}</label>}
                        {!template && (
                            <Field
                                type="text"
                                name="name"
                                required
                                placeholder={capitalize(t("name"))}
                                id="communicationTemplateNameField"
                                data-testid="name"
                            />
                        )}
                    </div>
                    <div>
                        <label htmlFor="communicationTemplateSubjectField">
                            {capitalize(t("subject")) + ":"}
                        </label>
                        <Field
                            type="text"
                            name="subject"
                            required
                            placeholder={capitalize(t("subject"))}
                            id="communicationTemplateSubjectField"
                            data-testid="subject"
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder={capitalize(t("template placeholder"))}
                            className="form-control"
                            style={{ height: "100px" }}
                            id="communicationTemplateTemplateField"
                            data-testid="template"
                            value={values.template}
                            onChange={(event) => setFieldValue("template", event.target.value)}
                        />
                    </div>

                    <button className="capitalize" data-testid="submit" type="submit">
                        {t("confirm")}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
