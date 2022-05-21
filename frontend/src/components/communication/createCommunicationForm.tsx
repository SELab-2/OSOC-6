import { IStudent } from "../../api/entities/StudentEntity";
import useSWR, { useSWRConfig } from "swr";
import apiPaths from "../../properties/apiPaths";
import { getAllCommunicationTemplatesFromPage } from "../../api/calls/communicationTemplateCalls";
import { Field, Form, Formik } from "formik";
import { Communication, defaultCommunicationMedium } from "../../api/entities/CommunicationEntity";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { createCommunicationSubmitHandler } from "../../handlers/createCommunicationSubmitHandler";
import { useState } from "react";
import { ICommunicationTemplate } from "../../api/entities/CommunicationTemplateEntity";
import { ButtonGroup, Dropdown } from "react-bootstrap";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import CommunicationTemplateInfo from "./communicationTemplateInfo";
import { useRouterPush } from "../../hooks/routerHooks";

/**
 * Properties needed by the [CreateCommunicationForm] component
 */
export interface CreateCommunicationFormProps {
    student: IStudent;
}

/**
 * Form component to create a new communication item with a given [IStudent].
 * @param student the [IStudent] to whom this communication was send.
 */
export default function CreateCommunicationForm({ student }: CreateCommunicationFormProps) {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
    const { mutate } = useSWRConfig();
    const { user, error: userError } = useCurrentUser();
    const { data: receivedTemplates, error: templateError } = useSWR(
        apiPaths.communicationTemplates,
        getAllCommunicationTemplatesFromPage
    );
    const [selectedTemplate, setSelectedTemplate] = useState<ICommunicationTemplate | undefined>(undefined);

    // We don't fill the sender and student because using the hooks this would require a reset of the initial values of the form.
    // Waiting to fill this avoids the reset.
    const initialValues: Communication = new Communication(defaultCommunicationMedium, "", "", "", "");

    const templates: ICommunicationTemplate[] = receivedTemplates || [];

    if (userError || templateError) {
        console.log(userError || templateError);
        return null;
    }

    return (
        <div data-testid="create-communication-form">
            <Formik
                initialValues={initialValues}
                onSubmit={async (submitCom: Communication) => {
                    submitCom.student = student._links.self.href;
                    submitCom.sender = user!._links.self.href;
                    await createCommunicationSubmitHandler(submitCom, routerAction, mutate);
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <h2>{capitalize(t("choose your template"))}</h2>

                        <Dropdown as={ButtonGroup} drop="down">
                            <Dropdown.Toggle
                                style={{
                                    backgroundColor: "#0a0839",
                                    borderColor: "white",
                                    height: 30,
                                    alignItems: "center",
                                    display: "flex",
                                }}
                                data-testid="template-select-main"
                            >
                                {capitalize(t("choose your template"))}
                            </Dropdown.Toggle>
                            <DropdownMenu>
                                {templates.map((template) => (
                                    <DropdownItem
                                        key={template._links.self.href}
                                        data-testid={"template-select-" + template._links.self.href}
                                        onClick={() => {
                                            setSelectedTemplate(template);
                                            setFieldValue("template", template._links.self.href);
                                            setFieldValue("content", template.template);
                                        }}
                                    >
                                        {template.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        {selectedTemplate && (
                            <CommunicationTemplateInfo template={selectedTemplate} student={student} />
                        )}

                        {values.template && (
                            <div>
                                <hr />

                                <h2>{capitalize(t("additional communication info"))}:</h2>

                                <Field
                                    type="text"
                                    placeholder={capitalize(t("medium"))}
                                    name="medium"
                                    required
                                    data-testid="medium"
                                />

                                <textarea
                                    placeholder={capitalize(t("communication content"))}
                                    className="form-control"
                                    style={{ height: "100px" }}
                                    data-testid="content"
                                    value={values.content}
                                    onChange={(event) => {
                                        setFieldValue("content", event.target.value);
                                    }}
                                />

                                <button className="capitalize" data-testid="submit" type="submit">
                                    {t("confirm")}
                                </button>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </div>
    );
}
