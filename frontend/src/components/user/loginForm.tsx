import { Field, Form, Formik } from "formik";
import styles from "../../styles/loginForm.module.css";

import { LoginProps } from "../../handlers/loginSubmitHandler";
import { capitalize } from "../../utility/stringUtil";
import useTranslation from "next-translate/useTranslation";

export default function LoginForm(props: LoginProps) {
    const { t } = useTranslation("common");
    return (
        <div className={styles.login_box}>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                }}
                onSubmit={props.submitHandler}
            >
                <Form>
                    <h6 style={{ marginTop: "40px" }}>{capitalize(t("email"))}</h6>
                    <Field
                        className={"form-control " + styles.login_field}
                        type="email"
                        data-testid="username"
                        name="username"
                        placeholder="Enter email address"
                        required
                    />
                    <h6>{capitalize(t("user password"))}</h6>
                    <Field
                        className={"form-control " + styles.login_field}
                        type="password"
                        data-testid="password"
                        name="password"
                        placeholder="Enter password"
                        required
                    />
                    <button className="btn btn-outline-primary" type="submit" data-testid="login-submit">
                        {capitalize(t("login"))}
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
