import { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import { StudentList } from "../components/studentList";
import { StudentFilterComponent } from "../components/studentFilterComponent";
import { capitalize } from "../utility/stringUtil";

const Students: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div className={styles.container}>
            <Head>
                <title>{capitalize(t("students"))}</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>{t("tool name")}</h1>
                <h2 className="capitalize">{t("students")}</h2>
                <StudentFilterComponent />
                <StudentList />
            </main>
        </div>
    );
};

export default Students;
