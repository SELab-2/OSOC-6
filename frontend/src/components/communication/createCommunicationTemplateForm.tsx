import { Field, Form, Formik } from "formik";
import { CommunicationTemplateEntity } from "../../api/entities/CommunicationTemplateEntity";
import { createCommunicationTemplateSubmitHandler } from "../../handlers/createCommunicationTemplateSubmitHandler";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";

/**
 * Form allowing the creation of a new communication template.
 */
export default function CreateCommunicationTemplateForm() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const initialValues: CommunicationTemplateEntity = new CommunicationTemplateEntity("", "", "");

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => createCommunicationTemplateSubmitHandler(values, router)}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <label className="capitalize" htmlFor="communicationTemplateNameField">
                        {capitalize(t("name")) + ":"}
                    </label>
                    <Field
                        type="text"
                        name="name"
                        required
                        placeHolder={capitalize(t("name"))}
                        id="communicationTemplateNameField"
                        data-testid="name"
                    />

                    <label className="capitalize" htmlFor="communicationTemplateSubjectField">
                        {capitalize(t("subject")) + ":"}
                    </label>
                    <Field
                        type="text"
                        name="subject"
                        required
                        placeHolder={capitalize(t("subject"))}
                        id="communicationTemplateSubjectField"
                        data-testid="subject"
                    />

                    <textarea
                        placeholder={capitalize(t("template placeholder"))}
                        className="form-control"
                        style={{ height: "100px" }}
                        id="communicationTemplateTemplateField"
                        data-testid="template"
                        value={values.template}
                        onChange={(event) => setFieldValue("template", event.target.value)}
                    />

                    <button className="capitalize" data-testid="submit" type="submit">
                        {t("confirm")}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
