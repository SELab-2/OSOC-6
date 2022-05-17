import type { NextPage } from "next";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/Home.module.css";
import UsersOverview from "../components/user/usersOverview";
import NavBar from "../components/util/navBar";

const Users: NextPage = () => {
    return (
        <main className={styles.main}>
            <NavBar />
            <UsersOverview />
        </main>
    );
};

export default Users;
