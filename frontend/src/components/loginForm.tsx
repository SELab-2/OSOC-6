import { Formik, Field, Form } from 'formik';
import styles from '../styles/loginForm.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Values {
    username: string;
    password: string;
}

export default function LoginForm() {
    const router = useRouter();
    return (
        <div className={styles.login_box}>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                onSubmit={async (values: Values) => {
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
                        router.push(response.request.responseURL);
                    });
                }}
            >
                <Form>
                    <Field
                        className="form-control mb-2"
                        id="username"
                        name="username"
                        placeholder="Enter email address"
                    />
                    <Field
                        className="form-control mb-2"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                    />
                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                </Form>
            </Formik>
        </div>
    );
}
