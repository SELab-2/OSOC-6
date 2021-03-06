import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/Home.module.css";
import EditionInfo from "../../components/edition/editionInfo";
import { useRouter } from "next/router";
import NavBar from "../../components/util/navBar";
import { Background } from "../../components/util/background";

const EditionInfoPage: NextPage = () => {
    const { t } = useTranslation("common");
    const router = useRouter();
    const id = router.query.id;
    return (
        <main className={styles.main}>
            <NavBar />
            <Background />
            <EditionInfo editionId={id as string} />
        </main>
    );
};

export default EditionInfoPage;
