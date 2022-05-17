import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Edition } from "../../api/entities/EditionEntity";
import { editionSubmitHandler } from "../../handlers/editionHandler";

/**
 * Form allowing the creation of a new edition.
 */
export default function CreateEditionForm() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const current_year = new Date().getFullYear();
    const initialValues: Edition = new Edition("", current_year, false);

    return (
        <Formik initialValues={initialValues} onSubmit={(values) => editionSubmitHandler(values, router)}>
            {({ values, setFieldValue }) => (
                <Form>
                    <label className="capitalize" htmlFor="editionNameField">
                        {t("name") + ":"}
                    </label>
                    <Field type="text" name="name" required id="editionNameField" data-testid="name" />

                    <label className="capitalize" htmlFor="editionYearField">
                        {t("year") + ":"}
                    </label>
                    <input
                        type="number"
                        min="1980"
                        max={current_year + 10}
                        step="1"
                        value={values.year}
                        onChange={(event) => setFieldValue("year", event.target.value)}
                        data-testid="year"
                    />

                    <label className="capitalize" htmlFor="editionActiveField">
                        {t("active") + ":"}
                    </label>
                    <Field type="checkbox" name="active" id="editionActiveField" data-testid="active" />

                    <button className="capitalize" data-testid="submit" type="submit">
                        {t("confirm")}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
