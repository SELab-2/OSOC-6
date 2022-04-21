import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ResetComponent } from '../components/resetComponent';
import Navbar from "../components/navBar"
import { saveEmailHandler } from '../handlers/confirmResetHandler';

const ChangeEmail: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{t("Reset email")}</title>
            </Head>
            <Navbar />
            <ResetComponent name={t('email')} handler={saveEmailHandler}/>
        </div>
);
};

export default ChangeEmail;
