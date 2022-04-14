import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { dataInjectionHandler } from "../handlers/dataInjectionHandler";
import ProjectAsignmentList from "../components/project_assignment/projectAssignmentList";

const Home: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.container}>
            <Head>
                <title>{t("Home page title")}</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>{t("Tool name")}</h1>
            </main>
            <button onClick={dataInjectionHandler}>Inject!</button>
            <ProjectAsignmentList />
        </div>
    );
};

export default Home;
