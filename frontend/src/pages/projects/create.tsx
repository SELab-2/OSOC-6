import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { ProjectForm } from "../../components/project/projectForm";
import { ProjectFormSubmitHandler } from "../../handlers/projectFormSubmitHandler";
import NavBar from "../../components/util/navBar";
import { capitalize } from "../../utility/stringUtil";

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
                    <h2>{capitalize(t("create project"))}</h2>
                    <ProjectForm submitHandler={ProjectFormSubmitHandler} />
                </div>
            </main>
        </div>
    );
};

export default CreateProject;
