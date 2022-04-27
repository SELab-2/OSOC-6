import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { Toast, ToastContainer } from "react-bootstrap";
import timers from "../properties/timers";
import { useState } from "react";
import { User } from "../api/entities/UserEntity";
import Router from "next/router";
import apiPaths from "../properties/apiPaths";
import { basePost, getParamsFromQueryUrl } from "../api/calls/baseCalls";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import { capitalize } from "../utility/stringUtil";
import { Formik, Field, Form } from "formik";
import styles from "../styles/loginForm.module.css";
import applicationPaths from "../properties/applicationPaths";

const RegistrationForm: NextPage = () => {
    const { t } = useTranslation("common");
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [error, setError] = useState<string>(t("no_error"));

    async function registrationHandler(values: {
        callname: string;
        email: string;
        password: string;
        repeat: string;
    }) {
        if (values.password == values.repeat) {
            const registratingUser: User = new User(values.callname, values.email, values.password);
            let invitationToken = getParamsFromQueryUrl(Router.asPath).get("invitationToken");
            // Token always ends on "=", but this character is removed in the paramsFromQueryURl method
            if (invitationToken[-1] !== "=") {
                invitationToken += "=";
            }

            try {
                await basePost(apiPaths.base + apiPaths.registration, registratingUser, {
                    token: invitationToken,
                });
                await loginSubmitHandler({ username: values.email, password: values.password });
                await Router.push(applicationPaths.home);
            } catch (error: any) {
                setError(error.response.data);
                setShowDanger(true);
            }
        } else {
            setError(capitalize(t("errorMessages:password_not_matching")));
            setShowDanger(true);
        }
    }

    return (
        <div>
            <Head>
                <title className="capitalize">{capitalize(t("registration"))}</title>
            </Head>
            <h1 className="display-6 mb-3 capitalize">{capitalize(t("registration"))}</h1>
            <div className={styles.login_box}>
                <Formik
                    initialValues={{
                        callname: "",
                        email: "",
                        password: "",
                        repeat: "",
                    }}
                    onSubmit={registrationHandler}
                >
                    <Form>
                        <Field
                            className="form-control mb-2"
                            type="text"
                            data-testid="callname"
                            name="callname"
                            placeholder={capitalize(t("enter callname"))}
                            required
                        />
                        <Field
                            className="form-control mb-2"
                            type="email"
                            data-testid="email"
                            name="email"
                            placeholder={capitalize(t("enter email"))}
                            required
                        />
                        <Field
                            className="form-control mb-2"
                            type="password"
                            data-testid="password"
                            name="password"
                            placeholder={capitalize(t("enter password"))}
                            required
                        />
                        <Field
                            className="form-control mb-2"
                            type="password"
                            data-testid="repeat"
                            name="repeat"
                            placeholder={capitalize(t("repeat password"))}
                            required
                        />
                        <button className="btn btn-primary" type="submit" data-testid="register-button">
                            {capitalize(t("register"))}
                        </button>
                    </Form>
                </Formik>
            </div>
            <ToastContainer position="bottom-end" data-testid="toast-registration">
                <Toast
                    bg="danger"
                    onClose={() => setShowDanger(false)}
                    show={showDanger}
                    delay={timers.toast}
                    autohide
                >
                    <Toast.Body>{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default RegistrationForm;
