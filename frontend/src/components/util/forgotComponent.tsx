import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/forgotPassword.module.css";
import {useState} from "react";
import {capitalize} from "../../utility/stringUtil";
import {Field, Form, Formik} from "formik";
import {AxiosResponse} from "axios";

interface ForgotComponentProps {
    handler: (email: string) => Promise<AxiosResponse>;
}

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
            <Form
                className="d-flex justify-content-center align-items-center flex-column"
                data-testid="forgot-password-form"
            >
                <h6 className="mt-5">{capitalize(t("reset password email"))}</h6>
                <Field
                    className={"form-control " + styles.max_width}
                    type="email"
                    data-testid="email"
                    name="email"
                    placeholder="Enter email address"
                    required
                />
                <button className="btn btn-primary mt-3" type="submit" data-testid="forgot-submit">
                    {capitalize(t("forgot email"))}
                </button>
                <div hidden={!showSuccess} className={"alert alert-success mt-3 " + styles.max_width}>
                    {capitalize(t("forgot email success"))}
                </div>
            </Form>
        </Formik>
    );
}
