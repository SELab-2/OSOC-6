import { Field, Form, Formik } from "formik";
import styles from "../styles/loginForm.module.css";

import { LoginProps } from "../handlers/loginSubmitHandler";

export default function LoginForm(props: LoginProps) {
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
                    <Field
                        className="form-control mb-2"
                        type="email"
                        data-testid="username"
                        name="username"
                        placeholder="Enter email address"
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        type="password"
                        data-testid="password"
                        name="password"
                        placeholder="Enter password"
                        required
                    />
                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
