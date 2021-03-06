import { NextPage } from "next";
import NavBar from "../../components/util/navBar";
import styles from "../../styles/pageGrids.module.css";
import useTranslation from "next-translate/useTranslation";
import EditionList from "../../components/edition/editionList";

/*
 * Page showing all editions
 */
const EditionPage: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <main className={styles.main}>
            <NavBar />
            <EditionList />
        </main>
    );
};

export default EditionPage;
