import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { CreateProjectForm } from "../../components/createProjectForm";
import { createProjectSubmitHandler } from "../../handlers/createProjectSubmitHandler";
import NavBar from "../../components/navBar";

const CreateProject: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title className="capitalize">{t("home page title")}</title>
            </Head>
            <NavBar />
            <main className={styles.main}>
                <div className="capitalize  m-4">
                    <h1 className={styles.title}>{t("tool name")}</h1>
                    <CreateProjectForm submitHandler={createProjectSubmitHandler} />
                </div>
            </main>
        </div>
    );
};

export default CreateProject;