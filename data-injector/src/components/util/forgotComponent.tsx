import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/resetComponent.module.css";
import { useState } from "react";
import { capitalize } from "../../utility/stringUtil";
import { Field, Form, Formik } from "formik";
import { AxiosResponse } from "axios";

/**
 * The props needed for the ForgotComponent.
 */
interface ForgotComponentProps {
    handler: (email: string) => Promise<AxiosResponse>;
}

/**
 * The value object that is passed to the doSubmit function.
 */
interface ForgotValue {
    email: string;
}

/**
 * Component used to enter email for a change password request.
 * @param submitHandler the handler to submit the email to
 */
export function ForgotComponent({ handler }: ForgotComponentProps) {
    const { t } = useTranslation("common");
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    function doSubmit(values: ForgotValue) {
        setShowSuccess(true);
        handler(values.email);
        values.email = "";
    }

    return (
        <Formik
            initialValues={{
                email: "",
            }}
            onSubmit={doSubmit}
        >
            <Form data-testid="forgot-password-form">
                <h6 className={"mt-4 mb-3"}>{capitalize(t("reset password email"))}</h6>
                <Field
                    className={"form-control " + styles.reset_field}
                    type="email"
                    data-testid="email"
                    name="email"
                    placeholder={capitalize(t("enter email"))}
                    required
                />
                <button className="btn btn-outline-primary mt-3" type="submit" data-testid="forgot-submit">
                    {capitalize(t("forgot email"))}
                </button>
                <div hidden={!showSuccess} className={"alert alert-success mt-3 " + styles.max_width}>
                    {capitalize(t("forgot email success"))}
                </div>
            </Form>
        </Formik>
    );
}
