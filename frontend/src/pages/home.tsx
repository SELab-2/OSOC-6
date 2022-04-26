import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { dataInjectionHandler } from "../handlers/dataInjectionHandler";
import NavBar from "../components/navBar";
import InvitationButton from "../components/invitationButton";

const Home: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title className="capitalize">{t("home page title")}</title>
            </Head>
            <NavBar />
            <main className={styles.main}>
                <div className="capitalize">
                    <h1 className={styles.title}>{t("tool name")}</h1>
                </div>
            </main>
            <button onClick={dataInjectionHandler}>Inject!</button>
            <InvitationButton/>
        </div>
    );
};

export default Home;
