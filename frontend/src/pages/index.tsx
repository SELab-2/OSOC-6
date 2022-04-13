import type { NextPage } from "next";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import NavBar from "../components/navBar";
import { ProjectList } from "../components/projectList";

const BeginPage: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>Open Summer of Code : Login page</title>
            </Head>
            <NavBar />
            <ProjectList />
            <main className="m-4">
                <h1>{t("Empty page")}</h1>
            </main>
        </div>
    );
};

export default BeginPage;
