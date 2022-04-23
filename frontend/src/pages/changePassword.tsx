import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { savePasswordHandler } from "../handlers/confirmResetHandler";
import { capitalize } from "../utility/stringUtil";

const ChangePassword: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{capitalize(t("reset password"))}</title>
            </Head>
            <Navbar />
            <ResetComponent name="password" handler={savePasswordHandler} />
        </div>
    );
};

export default ChangePassword;
