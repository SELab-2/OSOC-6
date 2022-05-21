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
import { Button } from "react-bootstrap";

/**
 * Properties of the [CreateCommunicationTemplateForm] component.
 */
export interface CreateCommunicationTemplateFormProps {
    template?: ICommunicationTemplate;
    setTemplate?: (template: ICommunicationTemplate) => void;
    setCreate?: (create: boolean) => void;
    setEdit?: (create: boolean) => void;
}

/**
 * Form allowing the creation of a new communication template or editing an existing.
 * @param template the template that should be edited. [undefined] if the form is in creation mode.
 */
export default function CreateCommunicationTemplateForm({
    template,
    setTemplate,
    setCreate,
    setEdit,
}: CreateCommunicationTemplateFormProps) {
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
            onSubmit={async (values) => {
                const newTemplate: ICommunicationTemplate = await createCommunicationTemplateSubmitHandler(
                    template ? template._links.self.href : null,
                    values,
                    router,
                    mutate
                );
                if (setTemplate) {
                    setTemplate(newTemplate);
                }

                if (setCreate) {
                    setCreate(false);
                }

                if (setEdit) {
                    console.log("edited");
                    setEdit(false);
                }
            }}
        >
            {({ values, setFieldValue }) => (
                <Form data-testid="template-form">
                    <div>
                        <h2>{template ? "Edit the template" : "Create new template"}</h2>
                        <hr />
                        <label htmlFor="communicationTemplateNameField">{capitalize(t("name")) + ":"}</label>

                        {template && (
                            <label style={{ paddingLeft: 25 }} id="communicationTemplateNameField">
                                {values.name}
                            </label>
                        )}
                        {!template && (
                            <Field
                                type="text"
                                name="name"
                                required
                                style={{
                                    backgroundColor: "#1b1a31",
                                    borderColor: "white",
                                    borderWidth: 1,
                                    color: "white",
                                    marginLeft: 24,
                                    marginBottom: 10,
                                    marginTop: 5,
                                    paddingLeft: 10,
                                }}
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
                            style={{
                                backgroundColor: "#1b1a31",
                                borderColor: "white",
                                borderWidth: 1,
                                color: "white",
                                marginLeft: 10,
                                marginBottom: 10,
                                marginTop: 5,
                                paddingLeft: 10,
                            }}
                            placeholder={capitalize(t("subject"))}
                            id="communicationTemplateSubjectField"
                            data-testid="subject"
                        />
                    </div>

                    <div>
                        <textarea
                            placeholder={capitalize(t("template placeholder"))}
                            className="form-control"
                            style={{
                                backgroundColor: "#1b1a31",
                                borderColor: "white",
                                borderWidth: 1,
                                height: "100px",
                                color: "white",
                                marginLeft: 10,
                                marginBottom: 10,
                                paddingLeft: 10,
                            }}
                            id="communicationTemplateTemplateField"
                            data-testid="template"
                            value={values.template}
                            onChange={(event) => setFieldValue("template", event.target.value)}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "row-reverse" }}>
                        <Button
                            className="capitalize"
                            data-testid="submit"
                            type="submit"
                            style={{
                                backgroundColor: "#1b1a31",
                                borderColor: "white",
                                height: 30,
                                alignItems: "center",
                                display: "flex",
                            }}
                        >
                            {capitalize(t("confirm"))}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
