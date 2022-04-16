import {NextPage} from "next";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import {dataInjectionHandler} from "../handlers/dataInjectionHandler";
import {useEffect, useState} from "react";
import async from "next-router-mock/src/async";
import {StudentList} from "../components/studentList";
import {getAllStudentsFromLinks} from "../api/calls/studentCalls";
import apiPaths from "../properties/apiPaths";

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
                <StudentList/>
            </main>
        </div>
    );
};

export default Students;