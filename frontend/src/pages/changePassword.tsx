import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ResetComponent } from '../components/resetComponent';
import Navbar from "../components/navBar"
import { savePasswordHandler } from '../handlers/confirmResetHandler';

const ChangePassword: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{t("Reset password")}</title>
            </Head>
            <Navbar />
            <ResetComponent name={t('Password')} handler={savePasswordHandler}/>
        </div>
);
};

export default ChangePassword;
