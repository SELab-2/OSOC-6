import type { NextPage } from "next";
import LoginForm from "../components/loginForm";
import { loginSubmitHandler } from "../handlers/loginSubmitHandler";
import useTranslation from "next-translate/useTranslation";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";

const Login: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { mutate } = useSWRConfig();
    return (
        <main className="m-4">
            <h1 className="display-6 mb-3 capitalize">{t("tool name")}</h1>
            <LoginForm submitHandler={(form) => loginSubmitHandler(form, router, mutate)} />
        </main>
    );
};

export default Login;
