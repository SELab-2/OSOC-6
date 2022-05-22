import { NextPage } from "next";
import RegistrationForm from "../components/user/registrationForm";
import NavBar from "../components/util/navBar";
import { capitalize } from "../utility/stringUtil";
import styles from "../styles/loginForm.module.css";
import { Col, Row } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import { Background } from "../components/util/background";

const Registration: NextPage = () => {
    const { t } = useTranslation("common");

    return (
        <div>
            <Background />
            <NavBar />
            <div className={styles.login_full_div}>
                <div className={styles.login_row}>
                    <div className={styles.login_floating_text_col}>
                        <h2 className={styles.login_floating_text}>{capitalize(t("let's get started"))}</h2>
                    </div>
                    <div className={styles.login_col}>
                        <div className={styles.login_div}>
                            <h3>{capitalize(t("registration"))}</h3>
                            <RegistrationForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
