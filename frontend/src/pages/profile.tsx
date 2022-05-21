import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import ProfileOverview from "../components/user/profileOverview";
import NavBar from "../components/util/navBar";
import { Background } from '../components/util/background';

const Profile: NextPage = () => {
    return (
        <main className={styles.main}>
            <NavBar />
            <Background/>
            <ProfileOverview />
        </main>
    );
};

export default Profile;
