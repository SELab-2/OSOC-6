import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { dataInjectionHandler } from "../handlers/dataInjectionHandler";
import { ProjectList } from "../components/projectList";
import NavBar from "../components/navBar";

const Home: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.container}>
            <Head>
                <title className="capitalize">{t("home page title")}</title>
            </Head>
            <main className={styles.main}>
                <div className="capitalize">
                    <h1 className={styles.title}>{t("tool name")}</h1>
                </div>
            </main>
            <NavBar />
            <ProjectList />
            <button onClick={dataInjectionHandler}>Inject!</button>
        </div>
    );
};

export default Home;
