import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ProfileOverview from "../components/profileOverview"
import NavBar from '../components/navBar';

const Profile: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div className={styles.container}>
            <Head>
                <title>{t("UserOverview My Profile")}</title>
            </Head>
            <main className={styles.main}>
                <NavBar/>
                <ProfileOverview/>
            </main>
        </div>
);
};

export default Profile;