import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { StudentList } from "../components/studentList";

const Students: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div className={styles.container}>
            <Head>
                <title>{t("Student page title")}</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>{t("Tool name")}</h1>
                <h2>{t("Student page title")}</h2>
                <StudentList />
            </main>
        </div>
    );
};

export default Students;
