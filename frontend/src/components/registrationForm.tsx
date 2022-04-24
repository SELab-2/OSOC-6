import { Formik, Field, Form } from "formik";
import styles from "../styles/loginForm.module.css";

export default function RegistrationForm(props: { submitHandler: (values: any) => void }) {
    return (
        <div className={styles.login_box}>
            <Formik
                initialValues={{
                    callname: "",
                    email: "",
                    password: "",
                    repeat: "",
                }}
                onSubmit={props.submitHandler}
            >
                <Form>
                    <Field
                        className="form-control mb-2"
                        type="text"
                        data-testid="callname"
                        name="callname"
                        placeholder="Enter callname"
                        required
                    />
                    <Field
                        className="form-control mb-2"
                        type="email"
                        data-testid="email"
                        name="email"
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
                    <Field
                        className="form-control mb-2"
                        type="password"
                        data-testid="repeat"
                        name="repeat"
                        placeholder="Repeat password"
                        required
                    />
                    <button className="btn btn-primary" type="submit">
                        Register
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
