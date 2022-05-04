import { Field, Form, Formik } from "formik";
import { CommunicationTemplateEntity } from "../../api/entities/CommunicationTemplateEntity";
import { createCommunicationTemplateSubmitHandler } from "../../handlers/createCommunicationTemplateSubmitHandler";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";

export default function CommunicationTemplateCreate() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const initialValues: CommunicationTemplateEntity = new CommunicationTemplateEntity("", "");

    return (
        <div>
            <h1 className="capitalize">{t("create communication template")}</h1>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => createCommunicationTemplateSubmitHandler(values, router)}
            >
                {({ values, setFieldValue }) => (
                    <Form>
                        <label className="capitalize" htmlFor="communicationTemplateNameField">
                            {t("name") + ":"}
                        </label>
                        <Field
                            type="text"
                            name="name"
                            required
                            id="communicationTemplateNameField"
                            data-testid="name"
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

                        <button data-testid="submit" type="submit">
                            submit
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
