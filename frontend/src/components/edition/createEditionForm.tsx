import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { Edition } from "../../api/entities/EditionEntity";
import { editionSubmitHandler } from "../../handlers/editionHandler";
import { Col, Row } from "react-bootstrap";
import styles from "../../styles/editionList.module.css";
import { useRouterPush } from "../../hooks/routerHooks";

/**
 * Form allowing the creation of a new edition.
 */
export default function CreateEditionForm() {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
    const currentYear = new Date().getFullYear();
    const initialValues: Edition = new Edition("", currentYear, false);

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values) => editionSubmitHandler(values, routerAction)}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <Row className={styles.edition_create_row}>
                        <Col>
                            <label className="capitalize" htmlFor="editionNameField">
                                {t("name") + ":"}
                            </label>
                        </Col>
                        <Col>
                            <Field
                                className={styles.edition_create_field}
                                type="text"
                                name="name"
                                required
                                id="editionNameField"
                                data-testid="name"
                            />
                        </Col>
                    </Row>
                    <Row className={styles.edition_create_row}>
                        <Col>
                            <label className="capitalize" htmlFor="editionYearField">
                                {t("year") + ":"}
                            </label>
                        </Col>
                        <Col>
                            <input
                                type="number"
                                min="1980"
                                max={currentYear + 10}
                                step="1"
                                value={values.year}
                                onChange={(event) => setFieldValue("year", event.target.value)}
                                data-testid="year"
                                className={styles.edition_create_field}
                            />
                        </Col>
                    </Row>
                    <Row className={styles.edition_create_row}>
                        <Col>
                            <label className="capitalize" htmlFor="editionActiveField">
                                {t("active") + ":"}
                            </label>
                        </Col>
                        <Col>
                            <Field
                                type="checkbox"
                                name="active"
                                id="editionActiveField"
                                data-testid="active"
                            />
                        </Col>
                    </Row>
                    <button
                        style={{ marginTop: "2rem" }}
                        className="capitalize btn btn-outline-primary"
                        data-testid="submit"
                        type="submit"
                    >
                        {t("confirm")}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
