import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import NavBar from "../../components/navBar";
import EditionOverview from "../../components/editionOverview";
import { capitalize } from "../../utility/stringUtil";
import { useRouter } from "next/router";

const Edition: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const id = router.query.id;
    console.log("PAGE ID: " + id);
    return (
        <main className={styles.main}>
            <NavBar />
            <EditionOverview editionId={id} />
        </main>
    );
};

export default Edition;
