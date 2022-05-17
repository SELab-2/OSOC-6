import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../../styles/Home.module.css";
import NavBar from "../../components/navBar";
import EditionOverview from "../../components/editionOverview";
import { useRouter } from "next/router";

const EditionInfoPage: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const id = router.query.id;
    return (
        <main className={styles.main}>
            <NavBar />
            <EditionOverview editionId={id as string} />
        </main>
    );
};

export default EditionInfoPage;
