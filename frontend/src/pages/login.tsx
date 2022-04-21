import type { NextPage } from "next";
import Head from "next/head";
import LoginForm from "../components/loginForm";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";

const Login: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{t("login page title")}</title>
            </Head>
            <main className="m-4">
                <h1 className="display-6 mb-3">{t("tool name")}</h1>
                <LoginForm submitHandler={loginSubmitHandler} />
            </main>
        </div>
    );
};

export default Login;
