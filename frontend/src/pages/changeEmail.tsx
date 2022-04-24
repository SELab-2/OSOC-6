import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ResetComponent } from "../components/resetComponent";
import Navbar from "../components/navBar";
import { saveEmailHandler } from "../handlers/confirmResetHandler";
import { capitalize } from "../utility/stringUtil";

const ChangeEmail: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{capitalize(t("reset email"))}</title>
            </Head>
            <Navbar />
            <ResetComponent name="email" handler={saveEmailHandler} />
        </div>
    );
};

export default ChangeEmail;