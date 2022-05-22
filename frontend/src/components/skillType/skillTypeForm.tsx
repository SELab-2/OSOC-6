import { SkillType } from "../../api/entities/SkillTypeEntity";
import { Field, Form, Formik } from "formik";
import { capitalize } from "../../utility/stringUtil";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useTranslation from "next-translate/useTranslation";
import { Badge } from "react-bootstrap";
import { createSkillTypeSubmitHandler } from "../../handlers/createSkillTypeSubmitHandler";
import { useRouterPush } from "../../hooks/routerHooks";

export default function SkillTypeForm() {
    const { t } = useTranslation("common");
    const routerAction = useRouterPush();
    const { mutate } = useSWRConfig();

    const initialValues = new SkillType("", "#9b685a");

    return (
        <div data-testid="skill-type-create-form">
            <Formik
                initialValues={initialValues}
                onSubmit={(values: SkillType) => createSkillTypeSubmitHandler(values, routerAction, mutate)}
            >
                {({ values }) => (
                    <Form>
                        <label className="form-label" htmlFor="skillTypeName">
                            {capitalize(t("name")) + ":"}
                        </label>
                        <div className="d-flex align-items-center">
                            <Field
                                type="text"
                                name="name"
                                required
                                placeholder={capitalize(t("name"))}
                                id="skillTypeName"
                                data-testid="name"
                                className="form-control w-50"
                            />
                            <div className="ms-3 w-50">
                                <Badge bg="" style={{ background: values.colour }}>
                                    {values.name}
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-2">
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
                        <button className="btn btn-primary mt-3" data-testid="submit" type="submit">
                            {capitalize(t("confirm"))}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
