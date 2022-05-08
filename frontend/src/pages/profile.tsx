import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import ProfileOverview from "../components/profileOverview";
import NavBar from "../components/navBar";

const Profile: NextPage = () => {
    return (
        <main className={styles.main}>
            <NavBar />
            <ProfileOverview />
        </main>
    );
};

export default Profile;
