import { Formik, Field, Form } from 'formik';
import styles from '../styles/loginForm.module.css';
import axios from 'axios';
import Router from "next/router";

interface Values {
    username: string;
    password: string;
}

export type Props = {
    submitHandler: (values: Values) => void;
};

export async function submitHandler(values: Values) {
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append('username', values.username);
    loginFormData.append('password', values.password);

    await axios({
        method: 'post',
        url: '/api/login-processing',
        data: loginFormData,
        headers: {
            'Content-Type': 'multipart/form-data',
            'access-control-allow-origin': '*',
        },
    }).then((response) => {
        console.log(response.request.responseURL);
        Router.push(response.request.responseURL)
    });
}

export default function LoginForm(props: Props) {
        return (
            <div className={styles.login_box}>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    onSubmit={ props.submitHandler }
                >
                    <Form>
                        <Field className="form-control mb-2" type="email" data-testid="username" name="username"
                            placeholder="Enter email address" required/>
                        <Field className="form-control mb-2" type="password" data-testid="password" name="password"
                               placeholder="Enter password" required/>
                        <button className="btn btn-primary" type="submit">Login</button>
                    </Form>
                </Formik>
            </div>
        );
}
