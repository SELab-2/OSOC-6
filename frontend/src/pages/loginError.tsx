import type { NextPage } from "next";
import Head from "next/head";
import LoginForm from "../components/loginForm";
import { Card } from "react-bootstrap";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../utility/stringUtil";

const LoginError: NextPage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Head>
                <title className="capitalize">{t("common:login page title")}</title>
            </Head>
            <h1 className="display-6 mb-3 capitalize">{t("common:tool name")}</h1>
            <main className="m-4">
                <Card>
                    <Card.Body>
                        <Card.Text>{capitalize(t("errorMessages:invalid_credentials"))}</Card.Text>
                    </Card.Body>
                </Card>
                <LoginForm submitHandler={loginSubmitHandler} />
            </main>
        </div>
    );
};

export default LoginError;
