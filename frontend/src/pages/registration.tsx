import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import RegistrationForm from "../components/registrationForm";
import { capitalize } from "../utility/stringUtil";
import NavBar from "../components/navBar";

const Registration: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div>
            <Head>
                <title className="capitalize">{capitalize(t("registration"))}</title>
            </Head>
            <NavBar />
            <RegistrationForm />
        </div>
    );
};

export default Registration;
