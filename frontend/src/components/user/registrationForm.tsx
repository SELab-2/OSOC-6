import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { Toast, ToastContainer } from "react-bootstrap";
import timers from "../../properties/timers";
import { useState } from "react";
import { User } from "../../api/entities/UserEntity";
import Router, { useRouter } from "next/router";
import apiPaths from "../../properties/apiPaths";
import { basePost, getParamsFromQueryUrl } from "../../api/calls/baseCalls";
import { loginSubmitHandler } from "../../handlers/loginSubmitHandler";
import { capitalize } from "../../utility/stringUtil";
import { Field, Form, Formik } from "formik";
import styles from "../../styles/registration.module.css";
import applicationPaths from "../../properties/applicationPaths";
import { useSWRConfig } from "swr";

const RegistrationForm: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [error, setError] = useState<string>(t("no error"));

    async function registrationHandler(values: {
        callname: string;
        email: string;
        password: string;
        repeat: string;
    }) {
        if (values.password == values.repeat) {
            const registratingUser: User = new User(values.callname, values.email, values.password);
            let invitationToken = getParamsFromQueryUrl(Router.asPath).get("invitationToken");

            try {
                await basePost(apiPaths.base + apiPaths.registration, registratingUser, {
                    token: invitationToken,
                });
                await loginSubmitHandler(
                    { username: values.email, password: values.password },
                    router,
                    mutate
                );
                await router.push("/" + applicationPaths.home);
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
            <div className={styles.registration_box}>
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
                        <h6>{capitalize(t("callname"))}</h6>
                        <Field
                            className={"form-control " + styles.registration_field}
                            type="text"
                            data-testid="callname"
                            name="callname"
                            placeholder={capitalize(t("enter callname"))}
                            required
                        />
                        <h6>{capitalize(t("email"))}</h6>
                        <Field
                            className={"form-control " + styles.registration_field}
                            type="email"
                            data-testid="email"
                            name="email"
                            placeholder={capitalize(t("enter email"))}
                            required
                        />
                        <h6>{capitalize(t("enter password"))}</h6>
                        <Field
                            className={"form-control " + styles.registration_field}
                            type="password"
                            data-testid="password"
                            name="password"
                            placeholder={capitalize(t("enter password"))}
                            required
                        />
                        <h6>{capitalize(t("repeat password"))}</h6>
                        <Field
                            className={"form-control " + styles.registration_field}
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
