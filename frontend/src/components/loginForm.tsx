import { Formik, Field, Form, FormikHelpers } from 'formik';
import styles from '../styles/loginForm.module.css'
import axios from "axios";
import {Response} from "next/dist/server/web/spec-compliant/response";

interface Values {
    username: string;
    password: string;
}

const handleSubmit = async(values: Values) => {
    console.log(values)
    // store the states in the form data
    const loginFormData = new FormData();
    loginFormData.append("username", values.username)
    loginFormData.append("password", values.password)

    try {
        const response = await axios({
            method:'post',
            url:'localhost:8080/login-processing',
            data: loginFormData,
            headers: {'Content-Type': 'multipart/form-data', 'access-control-allow-origin': '*'}
        }).catch((error: any) => console.log(JSON.stringify(error)))
        console.log(response)
    } catch(error: any) {
        console.log(error.response)
        console.log(error.response.data)
        console.log("Test")
    }
}

export default function LoginForm() {
    return (
        <div className={styles.login_box}>
            <h1 className="display-6 mb-3">Open Summer of Code</h1>
            <Formik
                initialValues={{
                    username: '',
                    password: ''
                }}
                onSubmit={ async (values) => {
                    // store the states in the form data
                    const loginFormData = new FormData();
                    loginFormData.append("username", values.username)
                    loginFormData.append("password", values.password)

                    const response = await fetch('/api/login-processing', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Access-control-allow-origin': '*',
                            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                            'Access-Control-Allow-Headers': 'Content-Type'
                        },
                        body: loginFormData,
                    })
                    console.log(response)
                }}
                //     const response = await axios({
                //         method:'post',
                //         url:'localhost:8080/login-processing',
                //         data: {
                //             username: values.username,
                //             password: values.password
                //         },
                //         headers: {"Access-Control-Allow-Origin": "*"}
                //     }).catch(error => console.log(error));
                //     console.log(response)
                // }}
            >
                <Form>
                    <Field className="form-control mb-2" id="username" name="username" placeholder="Enter email address"/>
                    <Field className="form-control mb-2" type="password" id="password" name="password" placeholder="Enter password"/>
                    <button className="btn btn-primary" type="submit">Login</button>
                </Form>
            </Formik>
        </div>
    )
}