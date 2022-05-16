import { SkillType } from "../../api/entities/SkillTypeEntity";
import { Field, Form, Formik } from "formik";
import { capitalize } from "../../utility/stringUtil";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useTranslation from "next-translate/useTranslation";
import { Badge } from "react-bootstrap";
import { createSkillTypeSubmitHandler } from "../../handlers/createSkillTypeSubmitHandler";

export default function SkillTypeForm() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();

    const initialValues = new SkillType("", "#9b685a");

    return (
        <div data-testid="skill-type-create-form">
            <Formik
                initialValues={initialValues}
                onSubmit={(values: SkillType) => createSkillTypeSubmitHandler(values, router, mutate)}
            >
                {({ values }) => (
                    <Form>
                        <div>
                            <label className="capitalize" htmlFor="skillTypeName">
                                {capitalize(t("name")) + ":"}
                            </label>
                            <Field
                                type="text"
                                name="name"
                                required
                                placeholder={capitalize(t("name"))}
                                id="skillTypeName"
                                data-testid="name"
                            />
                        </div>

                        <div>
                            <label htmlFor="colour" className="form-label">
                                {capitalize(t("color representing skill type"))}
                            </label>
                            <Field
                                type="color"
                                className="form-control form-control-color"
                                id="skillTypeColour"
                                data-testid="colour"
                                name="colour"
                                title={capitalize(t("color representing skill type"))}
                            />
                        </div>

                        <div>
                            <Badge bg="" style={{ background: values.colour }}>
                                {values.name}
                            </Badge>
                        </div>

                        <button className="capitalize" data-testid="submit" type="submit">
                            {t("confirm")}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
