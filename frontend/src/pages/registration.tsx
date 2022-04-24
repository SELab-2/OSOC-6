import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import NavBar from "../components/navBar";
import RegistrationForm from "../components/registrationForm";
import { Toast, ToastContainer } from "react-bootstrap";
import timers from "../properties/timers";
import { useState } from "react";
import { User } from "../api/entities/UserEntity";
import Router from "next/router";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import { capitalize } from "../utility/stringUtil";

const Registration: NextPage = () => {
    const { t } = useTranslation("common");
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [error, setError] = useState<string>(t("no_error"));

    async function registrationHandler(values: {
        callname: string;
        email: string;
        password: string;
        repeat: string;
    }) {
        console.log(values);
        if (values.password == values.repeat) {
            const registratingUser: User = new User(values.callname, values.email, values.password);
            // Use asPath instead of query to ignore the special characters in the token
            const invitationToken: string = Router.asPath.split("invitationToken=")[1];

            try {
                await axios.post(apiPaths.base + apiPaths.registration, registratingUser, {
                    params: {
                        token: invitationToken,
                    },
                    ...AxiosConf,
                });

                await loginSubmitHandler({ username: values.email, password: values.password });
                Router.push(apiPaths.home);
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
                <title className="capitalize">Registration</title>
            </Head>
            <NavBar />
            <h1 className="display-6 mb-3 capitalize">Registration</h1>
            <RegistrationForm submitHandler={registrationHandler} />
            <ToastContainer position="bottom-end">
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

export default Registration;
