import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import UsersOverview from "../components/usersOverview";
import NavBar from "../components/navBar";
import { capitalize } from "../utility/stringUtil";

const Users: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <Head>
                <title>{capitalize(t("users manage"))}</title>
            </Head>
            <main className={styles.main}>
                <NavBar />
                <UsersOverview />
            </main>
        </div>
    );
};

export default Users;
