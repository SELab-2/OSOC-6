import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import NavBar from "../components/navBar";

const BeginPage: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title className="capitalize">{t("tool name")}</title>
            </Head>
            <NavBar />
            <main className="m-4">
                <h1 className="capitalize">{t("empty page")}</h1>
            </main>
        </div>
    );
};

export default BeginPage;
